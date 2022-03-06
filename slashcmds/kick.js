const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to kick'))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for kicking this user.')),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const mem = interaction.options.getMember('user');
        const res = interaction.options.getString('reason') || null
        const embed = new MessageEmbed()

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setTitle('<:Error:949853701504372778> You do not have the `KICK_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setTitle('<:Error:949853701504372778> I do not have the `KICK_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!mem.kickable) {
            embed.setColor('DARK_RED')
            embed.setTitle('Missing permission!')
            embed.setDescription(`<:Error:949853701504372778> I can not kick <@${user.id}> **[ ${user.id} ]**\nCheck bot permissions please!`)
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        embed.setColor('GREEN')
        embed.setTitle(`Kick a member?`)
        embed.setDescription(`Are you sure you want to kick <@${user.id}>?`)
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
                },
                time: 15000
            })
            .catch(() => null);

        if (response === null) {
            embed.setColor('DARK_RED')
            embed.setTitle("Interaction timed out!")
            embed.setDescription('The response time for the command has expired')
            embed.setFooter('Enter the command again please')
            await interaction.followUp({ embeds: [embed], ephemeral: true })
            return;
        }

        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({ components: [row] });

        if (response.customId === 'yes') {
            await mem.kick(res)
            embed.setColor('GREEN')
            embed.setTitle(`Member has been kicked`)
            embed.setDescription(`<:Success:949853804155793450> **${user.tag}** has been kicked.\nModerator: **${interaction.user.tag}**\nReason: **${res}**`)
            await interaction.followUp({ embeds: [embed] });
            return;
        } else {
            embed.setColor('GREEN')
            embed.setTitle('Cancelled!')
            embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
            embed.setFooter('You can use another command')
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
}