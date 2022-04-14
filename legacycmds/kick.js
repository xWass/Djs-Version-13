const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: "kick",
    usage: "kick",
    description: "Kick a member.",
    async execute(client, message, args) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` messageCreate with content: ${message.content}`);
        let mem = message.mentions.members.first()
        const embed = new MessageEmbed()
        let id = message.guild.id

        const settings = await client.db.collection("settings").findOne({ guildid: id })

        if (!message.member.permissions.has('KICK_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `KICK_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> I do not have the `KICK_MEMBERS` permission!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.kickable) {
            embed.setColor('DARK_RED')
            embed.setTitle('Missing permission!')
            embed.setDescription(`<:Error:949853701504372778> I can not kick <@${mem.id}> **[ ${mem.id} ]**\nThis user most likely has a higher role than me or is the owner.`)
            await message.reply({ embeds: [embed], ephemeral: true, })
            return;
        }
        if (settings.enabled) {
            embed.setColor('DARK_RED')
            embed.setTitle(`Kick a member?`)
            embed.setDescription(`Are you sure you want to kick <@${mem.id}>?`)

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
            let sent = await message.reply({ embeds: [embed], components: [row], ephemeral: true });

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
                    time: 15000
                })
                .catch(() => null);

            if (response === null) {
                embed.setColor('DARK_RED')
                embed.setTitle('Interaction timed out!')
                embed.setDescription('The response time for the command has expired')
                embed.setFooter('Enter the command again please')
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                sent.edit({ components: [row] })
                await message.reply({ embeds: [embed], ephemeral: true })
                return;
            }


            if (response.customId === 'yes') {
                await message.guild.members.kick(mem.id)

                embed.setColor('GREEN')
                embed.setTitle('Member has been kicked')
                embed.setDescription(`<:Success:949853804155793450> **${mem.user.tag}** has been kicked.\nModerator: **${message.author.tag}**`)
                embed.setFooter(`ID: ${mem.id}`)

                await message.reply({ embeds: [embed], ephemeral: false });
            } else {
                embed.setTitle('Cancelled!')
                embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
                embed.setFooter('You can use another command')

                await message.reply({ embeds: [embed], ephemeral: true });
            }
        } else {
            await message.guild.members.kick(mem.id)

            embed.setColor('GREEN')
            embed.setTitle('Member has been kicked')
            embed.setDescription(`<:Success:949853804155793450> **${mem.user.tag}** has been kicked.\nModerator: **${message.author.tag}**`)
            embed.setFooter(`ID: ${mem.id}`)

            await message.reply({ embeds: [embed], ephemeral: false });

        }
    }
}
