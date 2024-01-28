const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('핑')
    .setDescription('봇의 핑을 체크합니다'),
  run({ client, interaction, }) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([ {
        name: '핑',
        value: `**${client.ws.ping}ms**`,
      }, ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {
    devOnly: true,
  },
};
