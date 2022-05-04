const { MessageEmbed } = require("discord.js");
const chalk = require('chalk');
const addZero = (i) => {
	if (i < 10) return `0${i}`
	return i
}
module.exports = {
    name: "userinfo",
    usage: "userinfo",
    description: "Displays user information",
    async execute(client, message, args) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command userinfo`);
        if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
            message.reply("This channel does not have the `EMBED_LINKS` permission enabled! This restricts me from sending embeds and completing my task.")
            return;
        } 
        const embed = new MessageEmbed()
        let mem = message.mentions.members.first()
        if(mem) {
            embed.setColor('GREEN')
            embed.setTitle(`Information about ${mem.user.tag}`)
            embed.setThumbnail(mem.user.avatarURL({ dynamic: true }))
            embed.addField('Username:', `${mem.user.username}`, true)
            embed.addField('Discriminator:', `${mem.user.discriminator}`, true)
            embed.addField('Created:', `<t:${Math.round(mem.user.createdAt / 1000)}:D> \n(<t:${Math.round(mem.user.createdAt / 1000)}:R>)`, true)
            embed.addField('Joined:', `<t:${Math.round(mem.joinedTimestamp / 1000)}:D> \n(<t:${Math.round(mem.joinedTimestamp / 1000)}:R>)`, true)
            embed.addField('ID:', `${mem.id}`, true)

            message.reply({ embeds: [embed] })
            return;
        }
		embed.setColor('GREEN')
		embed.setTitle(`Information about ${message.author.tag}`)
		embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
		embed.addField('Username:', `${message.author.username}`, true)
		embed.addField('Discriminator:', `${message.author.discriminator}`, true)
        embed.addField('Created:', `<t:${Math.round(message.author.createdAt / 1000)}:D> \n(<t:${Math.round(message.author.createdAt / 1000)}:R>)`, true)
        embed.addField('Joined:', `<t:${Math.round(message.member.joinedTimestamp / 1000)}:D> \n(<t:${Math.round(message.member.joinedTimestamp / 1000)}:R>)`, true)
		embed.addField('ID:', `${message.member.id}`, true)

        message.reply({ embeds: [embed] })
    }
}