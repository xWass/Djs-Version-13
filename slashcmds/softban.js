const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Select a member and ban them.')

        .addUserOption(option => option
            .setName('user')
            .setRequired(true)
            .setDescription('The member to softban. (Clears past 7 days of their messages)'))

        .addStringOption(option => option
            .setName('invite')
            .setRequired(true)
            .setDescription('Invite the user back? (y/n)')),

    async execute(interaction, client) {

        const user = interaction.options.getUser('user');
        const mem = interaction.options.getMember('user');
        const inv = interaction.options.getString('invite');
        let id = interaction.guild.id
        const settings = await client.db.collection("settings").findOne({ guildid: id })
        const embed = new MessageEmbed()

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `BAN_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> I do not have the `BAN_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.bannable) {
            embed.setColor('DARK_RED')
            embed.setTitle('Missing permission!')
            embed.setDescription(`<:Error:949853701504372778> I can not softban <@${user.id}> **[ ${user.id} ]**\nCheck bot permissions please!`)
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        if (settings.enabled) {

            embed.setColor('GREEN')
            embed.setTitle(`Softban a member?`)
            embed.setDescription(`Are you sure you want to softban <@${user.id}>?`)

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
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

            const response = await interaction.channel
                .awaitMessageComponent({
                    filter: (i) => {
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
                await interaction.editReply({ components: [row] });

                await interaction.followUp({ embeds: [embed], ephemeral: true })
            }


            if (response.customId === 'yes') {
                if (inv === "y") {
                    let invite = await interaction.channel.createInvite({
                        maxAge: 604800,
                        maxUses: 1
                    })

                    embed.setColor('GREEN')
                    embed.setTitle('You were softbanned from a server')
                    embed.setDescription(`<:Success:949853804155793450> Heres an invite back:\n**${invite}**`)
                    await user.send({ embeds: [embed], ephemeral: false })
                    await interaction.guild.members.ban(user.id, {
                        days: 7
                    })

                    await interaction.guild.bans.remove(user.id)
                    embed.setColor('GREEN')
                    embed.setTitle('Member has been softbanned')
                    embed.setDescription(`**${user.tag}** has been softbanned.\nModerator: **${interaction.user.tag}**\nThis user was invited back!`)
                    embed.setFooter('Thanks for using me!')
                    await interaction.followUp({ embeds: [embed], ephemeral: false });
                    return;
                } else {
                    embed.setColor('GREEN')
                    embed.setTitle('Member has been softbanned')
                    embed.setDescription(`**${user.tag}** has been softbanned.\nModerator: **${interaction.user.tag}**\nThis user was not invited back!`)
                    embed.setFooter('Thanks for using me!')
                    await interaction.guild.members.ban(user.id, {
                        days: 7
                    })

                    await interaction.guild.bans.remove(user.id)
                    await interaction.followUp({ embeds: [embed], ephemeral: false });
                    return;
                }
            } else
                embed.setColor('GREEN')
            embed.setTitle('Cancelled!')
            embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
            embed.setFooter('You can use another command')
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            if (inv === "y") {
                let invite = await interaction.channel.createInvite({
                    maxAge: 604800,
                    maxUses: 1
                })

                embed.setColor('GREEN')
                embed.setTitle('You were softbanned from a server')
                embed.setDescription(`<:Success:949853804155793450> Heres an invite back:\n**${invite}**`)
                await user.send({ embeds: [embed], ephemeral: false })
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })

                await interaction.guild.bans.remove(user.id)
                embed.setColor('GREEN')
                embed.setTitle('Member has been softbanned')
                embed.setDescription(`**${user.tag}** has been softbanned.\nModerator: **${interaction.user.tag}**\nThis user was invited back!`)
                embed.setFooter('Thanks for using me!')
                await interaction.reply({ embeds: [embed], ephemeral: false });
                return;
            } else {
                embed.setColor('GREEN')
                embed.setTitle('Member has been softbanned')
                embed.setDescription(`**${user.tag}** has been softbanned.\nModerator: **${interaction.user.tag}**\nThis user was not invited back!`)
                embed.setFooter('Thanks for using me!')
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })

                await interaction.guild.bans.remove(user.id)
                await interaction.reply({ embeds: [embed], ephemeral: false });
                return;
            }
        }
    }
}
