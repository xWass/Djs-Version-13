const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const chalk = require('chalk');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('contributers')
        .setDescription('Display all active contributers.'),
    async execute(interaction) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command contributers`);
        let embed = new MessageEmbed()
            .setTitle("Contributers")
            .setDescription("**These are people who have contributed to Diomedes code:** \nDEEM#0001 (ID:887395123145609218)\nbig.bun#6969 (471409054594498561)")
            .setFooter("Say thanks to the contributers :)")

        interaction.reply({ embeds: [embed] });


    }
}
