import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { commands, handleAutoreactCommand, getGuildConfig } from './commands.js';

export const startBot = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildEmojisAndStickers,
    ],
  });

  // Register slash commands
  const rest = new REST().setToken(config.DISCORD_TOKEN);

  client.once(Events.ClientReady, async () => {
    try {
      logger.info('Started refreshing application (/) commands.');

      // Get existing commands first
      const existingCommands = await rest.get(
        Routes.applicationCommands(client.user.id)
      );

      // Combine existing commands with our new ones, preserving entry point
      const commandsToRegister = [
        ...existingCommands.filter(cmd => cmd.name !== 'autoreact'),
        ...commands
      ];

      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandsToRegister }
      );

      logger.info('Successfully reloaded application (/) commands.');
      logger.info(`Logged in as ${client.user.tag}`);
      logger.info('Bot is ready to react to embeds!');
    } catch (error) {
      logger.error('Error refreshing commands:', error);
    }
  });

  // Handle slash commands
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'autoreact') {
      try {
        // Check for required permissions
        if (!interaction.memberPermissions?.has('ManageChannels')) {
          await interaction.reply({
            content: 'You need the "Manage Channels" permission to use this command.',
            ephemeral: true
          });
          return;
        }

        await handleAutoreactCommand(interaction);
      } catch (error) {
        logger.error('Error handling command:', error);
        await interaction.reply({ 
          content: 'An error occurred while executing the command.',
          ephemeral: true 
        });
      }
    }
  });

  client.on(Events.MessageCreate, async (message) => {
    try {
      // Ignore bot messages and DMs
      if (message.author.bot || !message.guild) return;

      // Get guild configuration
      const guildConfig = getGuildConfig(message.guild.id);

      // Check if channel is enabled (if channels are specified)
      if (Array.isArray(guildConfig.channels) && 
          guildConfig.channels.length > 0 && 
          !guildConfig.channels.includes(message.channel.id)) {
        logger.info(`Skipping message in ${message.channel.name} as it's not in the enabled channels list`);
        return;
      }

      // Enhanced debug logging for message content
      logger.info(`Processing message in ${message.guild.name}#${message.channel.name}`);
      logger.info(`Message content analysis:
        Has embeds: ${message.embeds.length > 0}
        Embed types: ${message.embeds.map(e => e.type).join(', ')}
        Has attachments: ${message.attachments.size > 0}
        Attachment types: ${Array.from(message.attachments.values()).map(a => a.contentType).join(', ')}
      `);

      // Check for any media content (embeds, videos, or attachments)
      const hasEmbed = message.embeds.length > 0;
      const hasAttachment = message.attachments.size > 0;
      const hasVideo = Array.from(message.attachments.values()).some(
        attachment => attachment.contentType?.startsWith('video/')
      );

      if (hasEmbed || hasAttachment || hasVideo) {
        logger.info(`Found media content in message ${message.id} - Embed: ${hasEmbed}, Attachment: ${hasAttachment}, Video: ${hasVideo}`);

        // Add reactions one by one with delay to prevent rate limiting
        for (const emoji of guildConfig.emojis) {
          try {
            await message.react(emoji);
            logger.info(`Successfully reacted with ${emoji} to message ${message.id}`);
            // Add a small delay between reactions to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            logger.error(`Failed to react with ${emoji} to message ${message.id}:`, error);

            // Only try to add error reaction if we haven't already
            if (!message.reactions.cache.has('❌')) {
              try {
                await message.react('❌');
              } catch (reactionError) {
                logger.error('Failed to add error reaction:', reactionError);
              }
            }
          }
        }
      } else {
        logger.info(`No media content found in message ${message.id}`);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
    }
  });

  // Handle disconnections and errors
  client.on(Events.Error, (error) => {
    if (error.message?.includes('disallowed intents')) {
      logger.error(
        'Missing required intents. Please enable "Message Content Intent" in the Discord Developer Portal.',
        error
      );
    } else {
      logger.error('Discord client error:', error);
    }
  });

  client.on('disconnect', () => {
    logger.warn('Bot disconnected from Discord. Attempting to reconnect...');
  });

  client.on('reconnecting', () => {
    logger.info('Bot is attempting to reconnect to Discord...');
  });

  client.on('resume', () => {
    logger.info('Bot connection resumed!');
  });

  try {
    logger.info('Attempting to connect to Discord...');
    await client.login(config.DISCORD_TOKEN);
    return client;
  } catch (error) {
    if (error instanceof Error && error.message.includes('disallowed intents')) {
      logger.error(`
Bot failed to start: Missing required intents
Please enable the following in Discord Developer Portal:
1. Go to https://discord.com/developers/applications
2. Select your bot
3. Click "Bot" in the left sidebar
4. Enable "Message Content Intent"
5. Save Changes`);
    } else {
      logger.error('Failed to connect to Discord:', error);
    }
    throw error;
  }
};
