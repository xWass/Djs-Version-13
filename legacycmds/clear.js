const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'clear',
  usage: 'clear',
  description: 'Purge messages from a channel.',
  async execute(client, message, args) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} messageCreate with content: ${message.content}`);

    const embed = new MessageEmbed();
    const { id } = message.guild;
    const amount = args[0];
    const settings = await client.db.collection('settings').findOne({ guildid: id });

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You do not have the `MANAGE_MESSAGES` permission!');
      await message.reply({ embeds: [embed] });
      return;
    }

    if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> I do not have the `MANAGE_MESSAGES` permission!');
      await message.reply({ embeds: [embed] });
      return;
    }

    if (!args[0]) {
      embed.setColor('DARK_RED');
      embed.setDescription('<:Error:949853701504372778> You did not specify a number of messages to clear!');
      await message.reply({ embeds: [embed] });
      return;
    }
    if (settings.enabled) {
      const amount = args[0];

      embed.setColor('GREEN');
      embed.setTitle('Clear Messages?');
      embed.setDescription(`Are you sure you want to clear **${amount}** messages?`);

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
      const sent = await message.reply({ embeds: [embed], components: [row] });

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
        await message.reply({ embeds: [embed] });
      }

      row.components[0].setDisabled(true);
      row.components[1].setDisabled(true);
      await response.update({ components: [row] });

      if (response.customId === 'yes') {
        embed.setColor('GREEN');
        embed.setTitle('<:Success:949853804155793450> Messages deleted!');
        embed.setDescription(`Amount: **${amount}**\nModerator: **${message.author.tag}**`);
        await message.delete();
        const tot = Number(args[0]) + 1;
        await message.channel.bulkDelete(tot);

        await message.channel.send({ embeds: [embed] });
      } else {
        embed.setColor('DARK_RED');
        embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled');

        await message.reply({ embeds: [embed] });
      }
    } else {
      embed.setColor('GREEN');
      embed.setTitle('<:Success:949853804155793450> Messages deleted!');
      embed.setDescription(`Amount: **${amount}**\nModerator: **${message.author.tag}**`);
      await message.delete();
      const tot = Number(args[0]);
      await message.channel.bulkDelete(tot);

      await message.channel.send({ embeds: [embed] });
    }
  },
};
