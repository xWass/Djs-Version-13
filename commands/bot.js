const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Client, client } = require('discord.js');
let days = Math.floor(client.uptime / 86400000);
let hours = Math.floor(client.uptime / 3600000) % 24;
let minutes = Math.floor(client.uptime / 60000) % 60;
let seconds = Math.floor(client.uptime / 1000) % 60;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('View bot information.'),
    async execute(interaction) {
        await interaction.reply({
            content: `Ping: ${interaction.client.ws.ping}ms \nUptime: ${days}d ${hours}h ${minutes}m ${seconds}s \nMemory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`,
            components: null,
            ephemeral: true
        });
    }
}
