const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Select a member and mute them.')

    .addUserOption((option) => option
      .setName('user')
      .setRequired(true)
      .setDescription('The member to mute.'))

    .addStringOption((option) => option
      .setName('time')
      .setRequired(true)
      .setDescription('Time to mute for. (1m, 1h, 1d, 1w. 28 days max)'))

    .addStringOption((option) => option
      .setName('reason')
      .setDescription('Reason for muting this user.')),

  async execute(interaction, client) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command mute`);
    const { id } = interaction.guild;
    const settings = await client.db.collection('settings').findOne({ guildid: id });
    const user = await interaction.options.getUser('user') || null;
    const mem = await interaction.options.getMember('user') || null;
    const res = await interaction.options.getString('reason') || null;
    const t = await interaction.options.getString('time') || 'No reason specified.';
    const embed = new MessageEmbed();
    const tt = ms(t);

    if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `TIMEOUT_MEMBERS` permission!');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> I do not have the `TIMEOUT_MEMBERS` permission!');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    if (message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest) < 0) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> This user has a higher role than you!');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!mem.moderatable) {
      embed.setColor('DARK_RED');
      embed.setDescription(`<:Error:949853701504372778> I can not mute <@${user.id}> **[ ${user.id} ]**\nCheck bot permissions please!`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    embed.setColor('GREEN');
    embed.setTitle('Mute a member?');
    embed.setDescription(`Are you sure you want to mute <@${user.id}>?`);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('yes')
          .setLabel('Confirm')
          .setStyle('SUCCESS'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId('no')
          .setLabel('Cancel')
          .setStyle('DANGER'),
      );
    if (settings.enabled) {
      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

      const response = await interaction.channel
        .awaitMessageComponent({
          filter: (i) => {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            return i.customId === 'yes' || i.customId === 'no';
          },
          time: 15000,
        })
        .catch(() => null);

      if (response === null) {
        embed.setColor('DARK_RED');
        embed.setDescription('<:Error:949853701504372778> The response time for the command has expired');
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await interaction.editReply({ components: [row] });
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        return;
      }

      if (response.customId === 'yes') {
        embed.setColor('GREEN');
        embed.setTitle('<:Success:949853804155793450> Member muted!');
        embed.setDescription(`<@${user.id}> has been muted.\nModerator: **${interaction.user.tag}**\nDuration: **${t}**\nReason: **${res}**`);
        await mem.timeout(tt, res);
        await interaction.followUp({ embeds: [embed] });
      } else {
        embed.setColor('GREEN');
        embed.setTitle('Cancelled!');
        embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled');
        embed.setFooter('You can use another command');
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      }
    } else {
      embed.setColor('GREEN');
      embed.setTitle('<:Success:949853804155793450> Member muted!');
      embed.setDescription(`<@${user.id}> has been muted.\nModerator: **${interaction.user.tag}**\nDuration: **${t}**\nReason: **${res}**`);
      await mem.timeout(tt, res);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
