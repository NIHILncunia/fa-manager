const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const {
  findCampain,
  api,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('세션등록')
    .setDescription('새로운 세션을 추가합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
    ))
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('세션 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('마스터')
        .setDescription('마스터를 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('보너스대상')
        .setDescription('PC 이름을 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명')?.value;
    const sessionNumber = interaction
      .options.get('번호')?.value;
    const sessionName = interaction
      .options.get('이름')?.value;
    const master = interaction
      .options.get('마스터')?.value;
    const bonusPC = interaction
      .options.get('보너스대상')?.value;

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

    const { data: newSession, } = await api.post('/session', {
      campain_id: campain.id,
      name: sessionName,
      number: sessionNumber,
      gm: master,
      bonus_pc: bonusPC,
    })

    const resultString = `[${newSession.number.toString().padStart(3, '0')} - ${newSession.name}] 세션이 등록되었습니다.`;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '등록 완료',
          value: `**${resultString}**`,
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
