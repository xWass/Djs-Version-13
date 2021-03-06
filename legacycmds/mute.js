const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ms = require('ms');
const chalk = require('chalk');

module.exports = {
  name: 'mute',
  usage: 'mute',
  description: 'Mute a member.',
  async execute(client, message, args) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} messageCreate with content: ${message.content}`);

    const mem = message.mentions.members.first();
    const embed = new MessageEmbed();
    const { id } = message.guild;
    const settings = await client.db.collection('settings').findOne({ guildid: id });

    if (!message.member.permissions.has('MODERATE_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `TIMEOUT_MEMBERS` permission!');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> I do not have the `TIMEOUT_MEMBERS` permission!');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!mem) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You failed to mention a member!');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    if (!mem.moderatable) {
      embed.setColor('DARK_RED');
      embed.setDescription(`<:Error:949853701504372778> I can not mute <@${mem.id}> **[ ${mem.id} ]**\nThis user most likely has a higher role than me or is the owner.`);
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    if (message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest) < 0) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> This user has a higher role than you!');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (args[1] === undefined) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You failed to provide a mute duration! \nFormat: ```1min, 1h, 1d```');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    const t = args[1];
    const tt = ms(t);

    if (isNaN(tt)) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You provided a duration in the incorrect format! \nFormat: ```1min, 1h, 1d```');
      await message.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    if (settings.enabled) {
      embed.setColor('DARK_RED');
      embed.setTitle('Mute a member?');
      embed.setDescription(`Are you sure you want to mute <@${mem.id}>?`);

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
      const sent = await message.reply({ embeds: [embed], components: [row], ephemeral: true });

      const response = await message.channel
        .awaitMessageComponent({
          filter: (i) => {
            const isInteractionUser = i.user.id === message.author.id;

            if (!isInteractionUser) {
              return false;
            }
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
        sent.edit({ components: [row] });
        await message.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (response.customId === 'yes') {
        await mem.timeout(tt);

        embed.setColor('GREEN');
        embed.setTitle('<:Success:949853804155793450> Member muted!');
        embed.setDescription(`${mem.user.tag} has been muted.\nModerator: **${message.author.tag}**\nDuration: **${t}**`);
        embed.setFooter(`ID: ${mem.id}`);

        await message.reply({ embeds: [embed], ephemeral: false });
      } else {
        embed.setTitle('Cancelled!');
        embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled');

        await message.reply({ embeds: [embed], ephemeral: true });
      }
    } else {
      await mem.timeout(tt);

      embed.setColor('GREEN');
      embed.setTitle('<:Success:949853804155793450> Member muted!');
      embed.setDescription(`${mem.user.tag} has been muted.\nModerator: **${message.author.tag}**\nDuration: **${t}**`);
      embed.setFooter(`ID: ${mem.id}`);

      await message.reply({ embeds: [embed], ephemeral: false });
    }
  },
};
