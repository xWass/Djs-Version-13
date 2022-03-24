const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ms = require('ms')
module.exports = {
    name: "unmute",
    usage: "unmute",
    description: "Unmute a member.",
    async execute(client, message, args) {
        let mem = message.mentions.members.first()
        const embed = new MessageEmbed()
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `TIMEOUT_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> I do not have the `TIMEOUT_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.moderatable) {
            embed.setColor('DARK_RED')
            embed.setTitle('Missing permission!')
            embed.setDescription(`<:Error:949853701504372778> I can not unmute <@${mem.id}> **[ ${mem.id} ]**\nThis user most likely has a higher role than me or is the owner.`)
            await message.reply({ embeds: [embed], ephemeral: true, })
            return;
        }

            await mem.timeout(null)

            embed.setColor('GREEN')
            embed.setTitle('Member has been unmuted')
            embed.setDescription(`${mem.user.tag} has been unmuted.\nModerator: **${message.author.tag}**`)
            embed.setFooter(`ID: ${mem.id}`)
            await message.reply({ embeds: [embed], ephemeral: false, })
    }
}