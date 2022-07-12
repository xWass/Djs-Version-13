const { MessageEmbed } = require('discord.js');
const { mem, cpu, os } = require('node-os-utils');
const chalk = require('chalk');

module.exports = {
  name: 'serverinfo',
  usage: 'serverinfo',
  description: 'Displays server information',
  async execute(client, message, args) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} messageCreate with content: ${message.content}`);

    const owner = await message.guild.fetchOwner();
    const embed = new MessageEmbed();
    embed.setColor('GREEN');
    embed.setTitle(message.guild.name);
    embed.setThumbnail('https://cdn.discordapp.com/avatars/928630913032658964/ead910d8dfac5012e21e618bce79a93a.png?size=4096');
    embed.addField('Owner', `${owner.user.username}#${owner.user.discriminator}`, true);
    embed.addField('Members', `${message.guild.memberCount}`, true);
    embed.addField('Roles', `${message.guild.roles.cache.size}`, true);
    embed.addField('Categories', `${message.guild.channels.cache.filter((c) => c.type === 'GUILD_CATEGORY').size}`, true);
    embed.addField('Text Channels', `${message.guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT').size}`, true);
    embed.addField('Voice Channels', `${message.guild.channels.cache.filter((c) => c.type === 'GUILD_VOICE').size}`, true);
    embed.addField('Emojis', `${message.guild.emojis.cache.size}`, true);
    embed.addField('Stickers', `${message.guild.stickers.cache.size}`, true);
    embed.addField('Verification Level', `${message.guild.verificationLevel}`, true);

    message.reply({ embeds: [embed] });
  },
};
