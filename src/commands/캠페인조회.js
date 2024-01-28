const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  api,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('캠페인조회')
    .setDescription('선택한 캠페인의 정보를 조회합니다.')
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

    const { data: sessions, } = await api.get('/session');

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '이름',
          value: campain.name,
        },
        {
          name: '상태',
          value: campain.status === 'OPEN' ? '진행중' : '종료',
        },
        {
          name: '진행된 세션 수',
          value: sessions.length.toString(),
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  option: {},
};
