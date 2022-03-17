const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "contributers",
    usage: "contributers",
    description: "Displays people who have contributed to the bot's code",
    async execute(client, message, args) {
            let embed = new MessageEmbed()
            .setTitle("Contributers")
            .setDescription("**These are people who have contributed to Diomedes code:** \nDEEM#0001 (ID:887395123145609218)")
            .setFooter("Say thanks to the contributers :)")
    
        await message.reply({ embeds: [embed] })
    }
}