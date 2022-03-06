const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display info about this server.'),
    async execute(interaction) {
        let embed = new MessageEmbed()
        .setTitle("Contributers")
        .setDescription("**These are people who have contributed to Diomedes code:** \nDEEM#0001 (ID:887395123145609218)")
        .setFooter("Say thanks to the contributers :)")

        interaction.reply({ embeds: [embed] });


    }
}