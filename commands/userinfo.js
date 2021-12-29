const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Display info about yourself.'),
	async execute(interaction) {
		interaction.followUp({
			content: `Your username: ${interaction.user.username} \nYour ID: ${interaction.user.id} \nAccount creation date: ${interaction.user.createdAt}`,
			ephemeral: false
		});
	},
};