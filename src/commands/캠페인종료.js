const {
  SlashCommandBuilder, PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  api,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('캠페인종료')
    .setDescription('캠페인의 종료를 선언합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인의 이름을 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명')?.value;

    const campain = await findCampain(campainName);

    if ('data' in campain) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**캠페인이 없습니다. 캠페인을 확인해주세요.**`,
          },
        ]);

      await interaction.reply({
        embeds: [ embed, ],
      });

      return;
    }

    const { data: updateCampain, } = await api.patch(`/campain/id/${campain.id}`, {
      status: 'CLOSE',
    })

    const { data: sessions, } = await api.get(`/session/id/${campain.id}`);

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '캠페인 종료',
          value: `[${updateCampain.name}] 캠페인이`
            + `**${sessions.length}**번의 세션을 진행하고 종료되었습니다.`,

        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
