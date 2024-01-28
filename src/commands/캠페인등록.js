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
    .setName('캠페인등록')
    .setDescription('새로운 캠페인을 등록합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('캠페인의 이름을 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('이름')?.value;

    const campain = await findCampain(campainName);

    if (campain.data) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**같은 이름의 캠페인이 존재합니다. 다른 이름으로 등록하세요.**`,
          },
        ]);

      interaction.reply({
        embeds: [ embed, ],
      });
      return;
    }

    const { data: newCampain, } = await api.post('/campain', {
      name: campainName,
    })

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '등록 완료',
          value: `**[${newCampain.name}] 캠페인이 등록되었습니다.**`,
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
