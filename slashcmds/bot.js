const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Client, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('View bot information.'),
    async execute(interaction) {


	    let days = Math.floor(interaction.client.uptime / 86400000);
	    let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
	    let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
	    let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setDescription(`Ping: ${interaction.client.ws.ping}ms \nUptime: ${days}d ${hours}h ${minutes}m ${seconds}s \nMemory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`)


        await interaction.reply({
            content: `Ping: ${interaction.client.ws.ping}ms \nUptime: ${days}d ${hours}h ${minutes}m ${seconds}s \nMemory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`,
            components: null,
            ephemeral: true,
            embeds: [embed]
        });
    }
}
