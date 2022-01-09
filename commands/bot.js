const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Client } = require('discord.js');
require("moment-duration-format");
const moment = require("moment");
const duration = moment
.duration(Client.uptime)
.format(" D[d], H[h], m[m]");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('View bot information.'),
    async execute(interaction) {
        await interaction.reply({
            content: `Ping: ${Client.ws.ping}ms \nUptime: ${duration} \nMemory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`,
            components: null,
            ephemeral: true
        });
    }
}
