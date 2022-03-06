const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { mem, cpu, os } = require('node-os-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('View bot information'),

    async execute(interaction) {
        const { totalMemMb, usedMemMb } = await mem.info();
        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;
        let guildsCount = 0
        let usersCount = 0

        interaction.client.guilds.cache.forEach(g => {
            guildsCount++
            usersCount += g.memberCount
        })

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor({ name: 'Diomedes Statistics', iconURL: 'https://cdn.discordapp.com/avatars/928630913032658964/ead910d8dfac5012e21e618bce79a93a.png?size=4096' })
            .addFields(
                { name: `Servers :computer:`, value: `\`\`\`${guildsCount}\`\`\``, inline: true },
                { name: `Users :family_mmbb:`, value: `\`\`\`${usersCount}\`\`\``, inline: true },
                { name: `Shard ID :newspaper:`, value: `\`\`\`1\`\`\``, inline: true },
                { name: `API Latency :ping_pong:`, value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true },
                { name: `Discord.js :tools:`, value: `\`\`\`13.4.0\`\`\``, inline: true },
                { name: `CPU Usage :bar_chart:`, value: `\`\`\`${await cpu.usage()} %\`\`\``, inline: true },
                { name: `Developers :pencil:`, value: `\`\`\`xWass#6841\`\`\``, inline: true },
                { name: `Contributers :pencil2:`, value: `\`\`\`DEEM#0001\`\`\``, inline: true },
                { name: `Uptime :green_circle:`, value: `\`\`\`${days}d ${hours}h ${minutes}m ${seconds}s\`\`\``, inline: true }
            )
            .setDescription(`
\`\`\`asciidoc
OS: ${await os.oos()}
CPU: ${cpu.model()}
Cores: ${cpu.count()}
CPU Usage: ${await cpu.usage()} %
RAM: ${totalMemMb} MB
RAM Usage: ${usedMemMb} MB
\`\`\`
`)

        await interaction.reply({ embeds: [embed] })
    }
}
