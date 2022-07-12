const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

const addZero = (i) => {
  if (i < 10) return `0${i}`;
  return i;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display info about yourself.'),

  async execute(interaction) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command userinfo`);
    const embed = new MessageEmbed();
    embed.setColor('GREEN');
    embed.setTitle(`Information about ${interaction.user.username}#${interaction.user.discriminator}`);
    embed.setThumbnail(interaction.user.avatarURL({ dynamic: true }));
    embed.addField('Username:', `${interaction.user.username}`, true);
    embed.addField('Discriminator:', `${interaction.user.discriminator}`, true);
    embed.addField('Created:', `${addZero(new Date(interaction.user.createdAt).getDate())}/${addZero(new Date(interaction.user.createdAt).getMonth() + 1)}/${new Date(interaction.user.createdAt).getFullYear()}`, true);
    embed.addField('Joined:', `${addZero(new Date(interaction.member.joinedTimestamp).getDate())}/${addZero(new Date(interaction.member.joinedTimestamp).getMonth() + 1)}/${new Date(interaction.member.joinedTimestamp).getFullYear()}`, true);
    embed.addField('ID:', `${interaction.user.id}`, true);

    interaction.reply({ embeds: [embed] });
  },
};
