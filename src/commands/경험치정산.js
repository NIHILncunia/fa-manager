const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const {
  findCampain,
  findSession,
  api,
  findPC,
} = require('../utils/axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('경험치정산')
    .setDescription('세션의 경험치를 정산합니다.')
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
    .addNumberOption((option) => (
      option
        .setName('경험치')
        .setDescription('세션의 경험치를 입력하세요.')
        .setRequired(true)
    )),
  async run({ interaction, }) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const sessionNumber = interaction
      .options.get('번호').value;
    const sessionExp = interaction
      .options.get('경험치').value;

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

    await api.patch(`session/id/${session.id}`, {
      exp: sessionExp,
    })

    const pcList = [];

    // 이런식으로 돌려봤는데 pcList에 값이 없음.
    for (const pcName of session.pc.split(',')) {
      // eslint-disable-next-line no-await-in-loop
      const pc = await findPC(campain.id, pcName);

      if (pc) {
        pcList.push(pc);
      } else {
        pcList.push('없음');
      }
    }

    const topLevel = pcList
      .filter((item) => item !== '없음')
      .sort((a, b) => {
        const aLevel = a.level;
        const bLevel = b.level;

        return bLevel - aLevel;
      }).at(0).level;

    const normalExp = sessionExp;
    const low1BonusExp = sessionExp + Math.floor(sessionExp * 0.5);
    const low2BonusExp = sessionExp * 2;
    const low3BonusExp = sessionExp + Math.floor(sessionExp * 1.5);

    const masterBonusExp = sessionExp + (sessionExp * 1.5);
    let gmPCGainExp;

    const gmPC = await findPC(campain.id, session.bonus_pc);

    if (topLevel === gmPC.level) {
      gmPCGainExp = masterBonusExp;
    } else if (topLevel - 1 === gmPC.level) {
      gmPCGainExp = masterBonusExp > low1BonusExp ? masterBonusExp : low1BonusExp;
    } else if (topLevel - 2 === gmPC.level) {
      gmPCGainExp = masterBonusExp > low2BonusExp ? masterBonusExp : low2BonusExp;
    } else {
      gmPCGainExp = masterBonusExp > low3BonusExp ? masterBonusExp : low3BonusExp;
    }

    if (gmPC.name === '리르갈') {
      gmPCGainExp = normalExp;
    }

    const { data: updateGmPC, } = await api.patch(`/player/id/${gmPC.id}`, {
      exp: (gmPC.exp + gmPCGainExp) >= 100
        ? (gmPC.exp + gmPCGainExp) - 100
        : gmPC.exp + gmPCGainExp,
      level: (gmPC.exp + gmPCGainExp) >= 100
        ? gmPC.level + 1
        : gmPC.level,
    })

    const updatePCList = [];

    for (const pc of pcList) {
      let newExp;
      let newLevel;

      if (topLevel === pc.level) {
        newExp = (pc.exp + normalExp) >= 100
          ? (pc.exp + normalExp) - 100
          : pc.exp + normalExp;
        newLevel = (pc.exp + normalExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else if (topLevel - 1 === pc.level) {
        newExp = (pc.exp + low1BonusExp) >= 100
          ? (pc.exp + low1BonusExp) - 100
          : pc.exp + low1BonusExp;
        newLevel = (pc.exp + low1BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else if (topLevel - 2 === pc.level) {
        newExp = (pc.exp + low2BonusExp) >= 100
          ? (pc.exp + low2BonusExp) - 100
          : pc.exp + low2BonusExp;
        newLevel = (pc.exp + low2BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else {
        newExp = (pc.exp + low3BonusExp) >= 100
          ? (pc.exp + low3BonusExp) - 100
          : pc.exp + low3BonusExp;
        newLevel = (pc.exp + low3BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      }

      // eslint-disable-next-line no-await-in-loop
      const { data: updatePC, } = await api.patch(`/player/id/${gmPC.id}`, {
        exp: newExp,
        level: newLevel,
      })

      updatePCList.push(updatePC);
    }

    updatePCList.push(updateGmPC);

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '세션 경험치',
          value: `${sessionExp}%`,
        },
        {
          name: 'PC 경험치 현황',
          value: updatePCList.map((pc) => (
            `[${pc.name}] 레벨 ${pc.level} (${pc.exp}%)\n`
          )).join(''),
        },
      ]);

    await interaction.reply({
      embeds: [ embed, ],
    });
  },
  options: {},
};
