const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display info about this server.'),
    async execute(interaction) {

        const owner = await interaction.guild.fetchOwner()
        const embed = new MessageEmbed()
        embed.setColor('GREEN')
        embed.setTitle(interaction.guild.name)
        embed.setThumbnail('https://cdn.discordapp.com/avatars/928630913032658964/ead910d8dfac5012e21e618bce79a93a.png?size=4096')
        embed.addField('Owner', `${owner.user.username}#${owner.user.discriminator}`, true)
        embed.addField('Members', `${interaction.guild.memberCount}`, true)
        embed.addField('Roles', `${interaction.guild.roles.cache.size}`, true)
        embed.addField('Categories', `${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size}`, true)
        embed.addField('Text Channels', `${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}`, true)
        embed.addField('Voice Channels', `${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}`, true)
        embed.addField('Emojis', `${interaction.guild.emojis.cache.size}`, true)
        embed.addField('Stickers', `${interaction.guild.stickers.cache.size}`, true)
        embed.addField('Verification Level', `${interaction.guild.verificationLevel}`, true)

        interaction.reply({ embeds: [embed] })
    },
};