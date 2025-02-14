# Klaude's Auto-Reaction Bot

This is a **Discord bot** that automatically reacts to **images, videos, and embeds** with a custom emoji.

Now with **channel-specific functionality**!

### ⚙️ Features
- [x] **Auto-reacts to embeds, images, and videos**  
- [x] **Custom emojis support**  
- [x] **Channel-specific reaction settings**  
- [x] **Easy setup & deployment**
- [ ] **Cure your depression**  

## I. CREATE A DISCORD BOT

To get your Discord bot token:
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **"New Application"** or select an existing one.
3. Navigate to the **"Bot"** section.
4. Click **"Reset Token"** or **"Copy"** to get your bot token.
5. Paste the token in the `.env` file (**DO NOT share it!**).

⚠️ **Important:** Never share your bot token or commit the `.env` file to version control!

## II. INSTALLATION

### 1. Clone the Repository
```bash
git clone https://github.com/iklaude/Klaude-Auto.git
cd Klaude-Auto
```

### 2. Install npm (if not already)
```bash
sudo apt install npm
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root and add the following:
```bash
# Discord Bot Token
DISCORD_TOKEN=your_token_here

# Emoji ID for reactions
# To get an emoji ID, type \<emoji> in Discord and copy the result.
UPVOTE_EMOJI=<:n_up:1101198180466573443>
```

### 4. Start the Bot
```bash
npm start
```
