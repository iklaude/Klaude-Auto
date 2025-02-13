# Discord Bot Project

This is a Discord bot that automatically manages and enhances message reactions with advanced channel-specific configuration and media detection capabilities.

## Files Structure
```
AllDiscordBotFiles/
├── src/
│   ├── index.js       # Entry point
│   ├── bot.js         # Main bot logic
│   ├── commands.js    # Slash commands implementation
│   ├── config.js      # Configuration and environment setup
│   ├── logger.js      # Logging utility
│   └── types.js       # Type definitions and constants
├── package.json       # Project dependencies
└── .env              # Environment variables (you need to create this)
```

## Setup Instructions

1. Create a `.env` file with your Discord bot token:
```
DISCORD_TOKEN=your_token_here
UPVOTE_EMOJI=your_emoji_id_here
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
node src/index.js
```

## Required Dependencies
- discord.js
- dotenv
- zod

## Features
- Automatic reaction management
- Channel-specific configuration
- Media detection capabilities
- Slash command support
