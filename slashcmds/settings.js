const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, Modal, MessageActionRow, TextInputComponent, MessageButton,
} = require('discord.js');
const chalk = require('chalk');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Adjust bot settings.')
    .addSubcommand((sub) => sub
      .setName('modconfirm')
      .setDescription('Enables or disables confirmation messages on moderation actions.')
      .addStringOption((stringOption) => stringOption
        .setName('modify')
        .setDescription('Enable or Disable?')
        .addChoice('Enable', 'enable')
        .addChoice('Disable', 'disable')
        .setRequired(true)))
    .addSubcommand((sub) => sub
      .setName('prefix')
      .setDescription('Changes the prefix of the bot in your server.')
      .addStringOption((option) => option
        .setName('prefix')
        .setDescription('The new prefix.')
        .setRequired(true))),

  async execute(interaction, client) {
    const embed = new MessageEmbed();
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

    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command test`);
    const chosen = await interaction.options.getSubcommand();

    if (chosen === 'modconfirm') {
      const change = interaction.options.getString('modify');
      embed.setDescription('Are you sure you want to update this setting?');
      interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });

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
        await response.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (response.customId === 'yes') {
        const { id } = interaction.guild;
        const found = await client.db.collection('settings').findOne({ guildid: id });
        if (!found) {
          await client.db.collection('settings').insertOne({ guildid: id });
        }
        if (change === 'enable') {
          await client.db.collection('settings').updateOne({ guildid: id }, { $set: { enabled: true } });
          embed.setColor('GREEN');
          embed.setTitle('Setting updated!');
          embed.setDescription('<:Success:949853804155793450> You will see confirmation messages when you run a moderator command.');
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(true);
          await interaction.editReply({ components: [row] });
          await response.reply({ embeds: [embed], ephemeral: true });
        } else if (change === 'disable') {
          await client.db.collection('settings').updateOne({ guildid: id }, { $set: { enabled: false } });
          embed.setColor('GREEN');
          embed.setTitle('Setting updated!');
          embed.setDescription('<:Success:949853804155793450> You will no longer see confirmation messages when you run a moderator command.');
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(true);
          await interaction.editReply({ components: [row] });
          await response.reply({ embeds: [embed], ephemeral: true });
        }
      } else {
        embed.setColor('GREEN');
        embed.setTitle('Cancelled!');
        embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled');
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await interaction.editReply({ components: [row] });
        await response.reply({ embeds: [embed], ephemeral: true });
      }
    } else {
      const prefix = interaction.options.getString('prefix');
      interaction.reply({ content: 'Hi! This feature is currently in development and is not yet released. Thanks!', ephemeral: true });
      // dont forget to add row components
    }
  },
};
