const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Display info about yourself.'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTimestamp()
			.setColor("RANDOM")
			.setTitle(`Your username: ${interaction.user.username} \nYour ID: ${interaction.user.id} \nAccount creation date: ${interaction.user.createdAt}`)
		interaction.reply({
			embeds: [embed],
			ephemeral: false
		});
	},
};