const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Select a member and unmute them.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to unmute.')),
    async execute(interaction) {
        const user = await interaction.options.getUser('user') || null
        const mem = await interaction.options.getMember('user') || null

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()

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
            embed.setTitle(`I can not unmute ${user.tag}`)
            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
            return;
        }
        await mem.timeout(null)
        embed.setTitle(`${user.tag} unmuted. \nModerator: ${interaction.user.tag}`)
        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
}
