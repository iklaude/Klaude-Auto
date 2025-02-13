This is a Discord bot that automatically manages and enhances message reactions with advanced channel-specific configuration and media detection capabilities.

## Create Discord Bot

To get your Discord bot token:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to the "Bot" section
4. Click "Reset Token" or "Copy" to get your bot token
5. Paste the token in your `.env` file

⚠️ Important: Never share your bot token or commit the `.env` file to version control!

## Installation
1. Clone the repository
```bash
git clone https://github.com/iklaude/Klaude-Auto.git
cd Klaude-Auto
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file and edit by following the example below:
```bash
# Discord Bot Token
DISCORD_TOKEN=your_token_here

# Emoji ID for reactions (Go to discord, type \<emoji>, you will get its ID like below.)
UPVOTE_EMOJI=<:n_up:1101198180466573443> 
```

4. Start the bot
```bash
npm start
