const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  findPC,
} = require('../utils/axios');
const { pcFullName, } = require('../utils/pcFullName');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pc조회')
    .setDescription('선택한 PC에 대한 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('PC 이름을 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명')?.value;
    const pcName = interaction
      .options.get('이름')?.value;

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

    const pc = await findPC(campain.id, pcName);

    if ('data' in pc) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**PC가 없습니다. 이름을 확인해주세요.**`,
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
          name: pcFullName[pc.name],
          value: `- 소속 캠페인 [${campain.name}]\n- 클래스 ${pc.class} ${pc.level} (${pc.exp}%)\n- 세션 참여 횟수 ${pc.play_count}회\n- 안식일 토큰 ${pc.play_token}개`,
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
