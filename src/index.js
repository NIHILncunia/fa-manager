const {
  Client,
  IntentsBitField,
} = require('discord.js');
const { CommandKit, } = require('commandkit');
const path = require('path');

require('dotenv/config');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessageReactions,
  ],
});

// eslint-disable-next-line no-new
new CommandKit({
  client,
  eventsPath: path.join(process.cwd(), 'src', 'events'),
  commandsPath: path.join(process.cwd(), 'src', 'commands'),
  devGuildIds: [ '888697033211392003', ],
  devUserIds: [ '197054124020334593', ],
});

client.login(process.env.TOKEN);
