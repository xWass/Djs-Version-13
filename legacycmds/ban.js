const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    usage: "ban",
    description: "Ban a member.",
    async execute(client, message, args) {        
        let mem = message.mentions.members.first()
        const embed = new MessageEmbed()
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `BAN_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> I do not have the `BAN_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.bannable) {
            embed.setColor('DARK_RED')
            embed.setTitle('Missing permission!')
            embed.setDescription(`<:Error:949853701504372778> I can not ban <@${mem.id}> **[ ${mem.id} ]**\nThis user most likely has a higher role than me or is the owner.`)
            await message.reply({ embeds: [embed], ephemeral: true, })
            return;
        }

        embed.setColor('DARK_RED')
        embed.setTitle(`Ban a member?`)
        embed.setDescription(`Are you sure you want to ban <@${mem.id}>?`)
        embed.setFooter(`ID: ${mem.id}`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            );
        await message.reply({ embeds: [embed], components: [row], ephemeral: true });

        const response = await message.channel
            .awaitMessageComponent({
                filter: (i) => {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    return i.customId === 'yes' || i.customId === 'no';
                }, time: 15000
            }).catch(() => null);

        if (response === null) {
            embed.setColor('DARK_RED')
            embed.setTitle('message timed out!')
            embed.setDescription('The response time for the command has expired')
            embed.setFooter('Enter the command again please')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);

        await response.update({ components: [row] });

        if (response.customId === 'yes') {
            await message.guild.members.ban(mem.id)
            embed.setColor('GREEN')
            embed.setTitle('Member has been banned')
            embed.setDescription(`<:Success:949853804155793450> **${mem.user.tag}** has been banned.\nModerator: **${message.author.tag}**`)
            await message.reply({ embeds: [embed], ephemeral: false });
        } else {
            embed.setTitle('Cancelled!')
            embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
            embed.setFooter('You can use another command')
            await message.reply({ embeds: [embed], ephemeral: true });
        }
    }
}