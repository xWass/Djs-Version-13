const { MessageEmbed } = require("discord.js");
const chalk = require('chalk');

module.exports = {
    name: "contributers",
    usage: "contributers",
    description: "Displays people who have contributed to the bot's code",
    async execute(client, message, args) {
        
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command contributers`);
        if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
            message.reply("This channel does not have the `EMBED_LINKS` permission enabled! This restricts me from sending embeds and completing my task.")
            return;
        }
        let embed = new MessageEmbed()
            .setTitle("Contributers")
            .setDescription("**These are people who have contributed to Diomedes code:** \nDEEM#0001 (ID:887395123145609218)")
            .setFooter("Say thanks to the contributers :)")

        await message.reply({ embeds: [embed] })
    }
}