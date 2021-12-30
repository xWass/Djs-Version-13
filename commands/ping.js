const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with ping!'),
	async execute(interaction) {
		interaction.reply(`Pong! ${interaction.client.ws.ping}`);
	},
};