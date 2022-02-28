
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Display info about this server.'),
    async execute(interaction) {

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setTitle(`Server name: ${interaction.guild.name} \nTotal members: ${interaction.guild.memberCount}`)

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    },
};