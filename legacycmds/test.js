
const { MessageEmbed } = require("discord.js");
const { execSync } = require('node:child_process');
const { Formatters: { codeBlock } } = require('discord.js');

const spec = execSync('screenfetch').toString();
module.exports = {
    name: "test",
    usage: "test",
    description: "test",
    async execute(client, message, args) {
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Hi')
            .setDescription(codeBlock('ansi', spec))

        await message.reply({ embeds: [embed] })
    }
}