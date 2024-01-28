const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  findSession,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('세션조회')
    .setDescription('지정한 세션 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('어떤 캠페인에 등록할지 입력하세요.')
        .setRequired(true)
    ))
    .addNumberOption((option) => (
      option
        .setName('번호')
        .setDescription('세션 번호를 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명')?.value;
    const sessionNumber = interaction
      .options.get('번호')?.value;

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

    const session = await findSession(campain.id, sessionNumber);

    if ('data' in session) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**세션을 찾을 수 없습니다.**`,
          },
        ]);

      await interaction.reply({
        embeds: [ embed, ],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: `[${session.number.toString().padStart(3, '0')} - ${session.name}]`,
          value: `- 마스터 [${session.gm}]\n- 참여 PC [${session.pc || ''}]\n- 세션 경험치 [${session.exp}%]`,
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
