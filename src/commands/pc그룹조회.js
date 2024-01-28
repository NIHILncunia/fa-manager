const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  findPC,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pc그룹조회')
    .setDescription('여러 PC의 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('조회목록')
        .setDescription('조회할 PC 이름들을 입력하세요. 쉼표로 구분합니다.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const pcNameList = interaction
      .options.get('조회목록').value;

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

    const pcList = [];

    // 이런식으로 돌려봤는데 pcList에 값이 없음.
    for (const pcName of pcNameList.split(',')) {
      // eslint-disable-next-line no-await-in-loop
      const pc = await findPC(campain.id, pcName);

      if (pc) {
        pcList.push(pc);
      } else {
        pcList.push('없음');
      }
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '조회완료',
          value: pcList.map((pc) => {
            if (pc !== '없음') {
              // eslint-disable-next-line no-unused-expressions
              `[${pc.name}] 레벨 ${pc.level} (${pc.exp}%)\n- 참여 횟수 ${pc.play_count}회 안식일 토큰 ${pc.play_token}개\n\n`;
            } else {
              // eslint-disable-next-line no-unused-expressions
              `[찾을 수 없음]`;
            }
          }).join(''),
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
