const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with ping!'),
	async execute(interaction) {
		return interaction.reply(`Pong! ${client.ws.ping}ms.`);
	},
};