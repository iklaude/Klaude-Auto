import { 
  SlashCommandBuilder, 
  ChannelType,
  Collection
} from 'discord.js';
import { DEFAULT_CONFIG } from './types.js';

const configs = new Collection();

export const getGuildConfig = (guildId) => {
  if (!configs.has(guildId)) {
    configs.set(guildId, { ...DEFAULT_CONFIG });
  }
  return configs.get(guildId);
};

export const commands = [
  new SlashCommandBuilder()
    .setName('autoreact')
    .setDescription('Configure auto-reactions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('emoji')
        .setDescription('Set emoji(s) for auto-reactions')
        .addStringOption(option =>
          option
            .setName('emojis')
            .setDescription('Space-separated list of emojis (max 8)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('Add a channel for auto-reactions')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to add')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('channels')
        .setDescription('List all channels with auto-reactions enabled')
    ),
];

export async function handleAutoreactCommand(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guildId;
  const config = getGuildConfig(guildId);

  if (subcommand === 'emoji') {
    // Defer the reply immediately
    await interaction.deferReply();

    const emojisInput = interaction.options.getString('emojis', true);
    const emojis = emojisInput.trim().split(/\s+/);

    if (emojis.length === 0) {
      await interaction.editReply('Please provide at least one emoji.');
      return;
    }

    // Silently truncate if more than 8 emojis
    if (emojis.length > 8) {
      emojis.length = 8;
    }

    const validEmojis = [];
    const invalidEmojis = [];

    // Test each emoji by trying to use them
    for (const emoji of emojis) {
      try {
        // Create a test message in memory to validate emoji
        const isValidEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|<a?:.+?:\d{17,19}>/.test(emoji);
        if (isValidEmoji) {
          validEmojis.push(emoji);
        } else {
          invalidEmojis.push(emoji);
        }
      } catch {
        invalidEmojis.push(emoji);
      }
    }

    // Update configuration with valid emojis
    if (validEmojis.length > 0) {
      config.emojis = validEmojis;
      let content = `Successfully set ${validEmojis.length} emoji${validEmojis.length > 1 ? 's' : ''} for auto-reactions: ${validEmojis.join(' ')}`;
      if (invalidEmojis.length > 0) {
        content += `\n⚠️ ${invalidEmojis.length} invalid emoji${invalidEmojis.length > 1 ? 's were' : ' was'} skipped.`;
      }
      if (emojis.length > 8) {
        content += '\n⚠️ Maximum 8 emojis allowed. Extra emojis were ignored.';
      }
      await interaction.editReply(content);
    } else {
      await interaction.editReply('❌ No valid emojis were provided. Please try again with valid Discord emojis.');
    }
  } else if (subcommand === 'channel') {
    const channel = interaction.options.getChannel('channel', true);

    // Initialize channels array if it doesn't exist
    if (!Array.isArray(config.channels)) {
      config.channels = [];
    }

    // Check if channel is already in the list
    if (config.channels.includes(channel.id)) {
      await interaction.reply({
        content: `${channel} is already in the auto-reaction channels list.`,
        ephemeral: true
      });
      return;
    }

    // Add the channel
    config.channels.push(channel.id);
    await interaction.reply(`Added ${channel} to auto-reaction channels.`);

  } else if (subcommand === 'channels') {
    // Initialize channels array if it doesn't exist
    if (!Array.isArray(config.channels)) {
      config.channels = [];
    }

    if (config.channels.length === 0) {
      await interaction.reply('Auto-reactions are currently enabled in all channels.');
    } else {
      const channelList = config.channels.map(id => `<#${id}>`).join('\n');
      await interaction.reply(`Channels with auto-reactions enabled:\n${channelList}`);
    }
  }
}
