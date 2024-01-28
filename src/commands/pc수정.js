const {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const {
  findCampain,
  findPC,
  api,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pc수정')
    .setDescription('선택한 PC를 수정합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
    ))
    .addNumberOption((option) => (
      option
        .setName('레벨')
        .setDescription('변경할 레벨을 입력하세요.')
    ))
    .addNumberOption((option) => (
      option
        .setName('경험치')
        .setDescription('변경할 경험치를 입력하세요.')
    ))
    .addNumberOption((option) => (
      option
        .setName('안식일토큰')
        .setDescription('변경할 수량을 입력하세요.')
    )),
  async run({ interaction, }) {
    const campainName = interaction.options.get('캠페인명').value;
    const pcName = interaction.options.get('이름').value;
    const level = interaction.options.get('레벨')?.value;
    const exp = interaction.options.get('경험치')?.value;
    const token = interaction.options.get('안식일토큰')?.value;

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

    const pc = await findPC(pcName);

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

    const { data: updatePC, } = await api.patch(`/player/id/${pc.id}`, {
      level,
      exp,
      play_token: token,
    });

    const levelString = level ? `[${updatePC.name}] [레벨 ${updatePC.level}](으)로 변경\n` : '';
    const expString = exp ? `[${updatePC.name}] [경험치 ${updatePC.exp}%]로 변경\n` : '';
    const tokenString = token !== undefined ? `[${updatePC.name}] [안식일 토큰 ${updatePC.play_token}개]로 변경` : '';

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '수정완료',
          value: `${levelString}${expString}${tokenString}`,
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
