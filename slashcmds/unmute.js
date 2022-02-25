const {
    SlashCommandBuilder
} = require('@discordjs/builders');
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
        if (!interaction.member.permissions.has('MODERATE_MEMBERS'))
            return void (await interaction.reply({
                content: 'You do not have the `TIMEOUT_MEMBERS` permission.',
                ephemeral: true
            }));
        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS'))
            return void (await interaction.reply({
                content: 'I do not have the `TIMEOUT_MEMBERS` permission.',
                ephemeral: true
            }));

        if (!mem.moderatable)
            return void (await interaction.reply({
                content: 'I cannot unmute this user.',
                ephemeral: true
            }));
        await mem.timeout(null)
        await interaction.reply({
            content: `${user} unmuted.`,
            ephemeral: false
        });
    }
}
