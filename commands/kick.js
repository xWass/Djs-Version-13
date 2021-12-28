const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The member to kick')),
    async execute(interaction) {

        const user = interaction.options.getUser('user');
		const mem = interaction.options.getMember('user');

        if (!interaction.member.permissions.has('KICK_MEMBERS'))
            return void (await interaction.reply({
                content: 'You do not have the `KICK_MEMBERS` permission.',
                ephemeral: true
            }));

        if (!interaction.guild.me.permissions.has('KICK_MEMBERS'))
            return void (await interaction.reply({
                content: 'I do not have the `KICK_MEMBERS` permission.',
                ephemeral: true
            }));

			if (!mem.kicknable) {
				interaction.reply({
					content: `I can not kick ${user.tag}.`,
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
        await interaction.reply({
            content: `Are you sure you want to kick ${user.tag}?`,
            components: [row],
            ephemeral: true
        });
        const response = await interaction.channel
            .awaitMessageComponent({
                filter: (i) => {
                    const isInteractionUser = i.user.id === interaction.user.id;
                    if (!isInteractionUser) {
                        i.followUp({
                            content: "You can't use this!",
                            ephemeral: true
                        });
                        return false;
                    }
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    return i.customId === 'yes' || i.customId === 'no';
                },
                time: 15000
            })
            .catch(() => null);
        if (response === null)
            return void (await interaction.followUp({
                content: 'Time out! Operation cancelled.',
                ephemeral: true
            }));
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({
            components: [row]
        });
        if (response.customId === 'yes') {
			await interaction.guild.members.kick(user.id)
            await interaction.followUp({
                content: `${user} kicked.`,
                ephemeral: false
            });
        } else
            await interaction.followUp({
                content: 'Cancelled!',
                ephemeral: true
            });
    }
}