const { MessageEmbed } = require("discord.js");
const chalk = require('chalk');

module.exports = {
    name: "contributers",
    usage: "contributers",
    description: "Displays people who have contributed to the bot's code",
    async execute(client, message, args) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command contributers`);
        let embed = new MessageEmbed()
            .setTitle("Contributers")
            .setDescription("**These are people who have contributed to Diomedes code:** \nDEEM#0001 (ID:887395123145609218)\nbig.bun#6969 (471409054594498561)")
            .setFooter("Say thanks to the contributers :)")

        await message.reply({ embeds: [embed] })
    }
}
