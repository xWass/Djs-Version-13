const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption(option => option
            .setName('user')
            .setRequired(true)
            .setDescription('The member to ban')),
    async execute(interaction, client) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command ban`);
        let id = interaction.guild.id
        const settings = await client.db.collection("settings").findOne({ guildid: id })
        const user = interaction.options.getUser('user');
        const mem = interaction.options.getMember('user');
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
        if(message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest) < 0){
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> This user has a higher role than you!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.bannable) {
            embed.setColor('DARK_RED')
            embed.setDescription(`<:Error:949853701504372778> I can not ban <@${user.id}> **[ ${user.id} ]**\nCheck bot permissions please!`)
            await interaction.reply({ embeds: [embed], ephemeral: true, })
            return;
        }
        if (settings.enabled) {
            let user = interaction.options.getUser('user');
            let mem = interaction.options.getMember('user');
            embed.setColor('DARK_RED')
            embed.setTitle(`Ban this member?`)
            embed.setDescription(`Are you sure you want to ban <@${user.id}>?`)
            embed.setFooter(`ID: ${user.id}`)

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
                    }, time: 15000
                }).catch(() => null);

            if (response === null) {
                embed.setColor('DARK_RED')
                embed.setDescription('<:Error:949853701504372778> The response time for the command has expired')
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await interaction.editReply({ components: [row] });

                await interaction.followUp({ embeds: [embed], ephemeral: true })
                return;
            }


            if (response.customId === 'yes') {
                await interaction.guild.members.ban(user.id)
                embed.setColor('GREEN')
                embed.setTitle('<:Success:949853804155793450> Member banned!')
                embed.setDescription(`<:Success:949853804155793450> **${user.tag}** has been banned.\nModerator: **${interaction.user.tag}**`)
                await interaction.followUp({ embeds: [embed], ephemeral: false });
            } else {
                embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
        } else {
            await interaction.guild.members.ban(user.id)
            embed.setColor('GREEN')
            embed.setTitle('<:Success:949853804155793450> Member banned!')
            embed.setDescription(`<:Success:949853804155793450> **${user.tag}** has been banned.\nModerator: **${interaction.user.tag}**`)
            await interaction.reply({ embeds: [embed], ephemeral: false });

        }
    }
}
