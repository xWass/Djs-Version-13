const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to kick'))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for muting this user.')),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const mem = interaction.options.getMember('user');
        const res = interaction.options.getString('reason') || null

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            embed.setTitle("You do not have the `KICK_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
            embed.setTitle("I do not have the `KICK_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!mem.kickable) {
            embed.setTitle(`I can not kick ${user.tag}`)
            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
            return;
        }

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
        embed.setTitle(`Are you sure you want to kick ${user.tag}?`)
        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
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
            embed.setTitle("Interaction timed out!")
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({
            components: [row]
        });
        if (response.customId === 'yes') {
            await mem.kick(res)
            embed.setTitle(`${user.tag} kicked. \nModerator: ${interaction.user.tag} \nReason: ${res}`)
            await interaction.followUp({
                embeds: [embed],
                ephemeral: false
            });
            return;
        } else {
            embed.setTitle("Interaction cancelled!")
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}