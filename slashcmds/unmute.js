const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Select a member and unmute them.')

        .addUserOption(option => option
            .setName('user')
            .setRequired(true)
            .setDescription('The member to unmute.')),

    async execute(interaction) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command unmute`);
        const user = await interaction.options.getUser('user') || null
        const mem = await interaction.options.getMember('user') || null
        const embed = new MessageEmbed()

        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `TIMEOUT_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setTitle('<:Error:949853701504372778> I do not have the `TIMEOUT_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        if(message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest) < 0){
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> This user has a higher role than you!')
            await message.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.moderatable) {
            embed.setColor('DARK_RED')
            embed.setDescription(`<:Error:949853701504372778> I can not unmute <@${user.id}> **[ ${user.id} ]**\nMember maybe not have mute or check bot permissions please!`)
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        await mem.timeout(null)
        embed.setColor('GREEN')
        embed.setTitle('<:Success:949853804155793450> Member unmuted!')
        embed.setDescription(`**${user.tag}** has been unmuted.\nModerator: **${interaction.user.tag}**`)
        await interaction.reply({ embeds: [embed] });
    }
}