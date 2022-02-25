const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require('discord.js');

const ms = require('ms')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Select a member and mute them.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to mute.'))
        .addStringOption(option => option
            .setName('time')
            .setDescription('Time to mute for. (1m, 1h, 1d, 1w. 28 days max)'))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for muting this user.')),

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()

        const user = await interaction.options.getUser('user') || null
        const mem = await interaction.options.getMember('user') || null
        const res = await interaction.options.getString('reason') || null
        const t = await interaction.options.getString('time') || "No reason specified."
        const tt = ms(t)
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            embed.setTitle("You do not have the `TIMEOUT_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) {
            embed.setTitle("I do not have the `TIMEOUT_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!mem.moderatable) {
            embed.setTitle(`I can not mute ${user.tag}`)
            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
            return;
        }
        if (t === null) {
            embed.setTitle("You failed to provide a mute duration!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
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
        embed.setTitle(`Are you sure you want to mute ${user.tag}?`)
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
            embed.setTitle("Interaction timed out.")
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
            embed.setTitle(`${user.tag} muted. \nModerator: ${interaction.user.tag} \nDuration: ${t} \nReason: ${res}`)
            await mem.timeout(tt, res)
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