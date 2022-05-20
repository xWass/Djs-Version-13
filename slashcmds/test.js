const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('test')
        .addSubcommand(sub => sub
            .setName('user')    
            .setDescription('test'))
			.addUserOption(option => option.setName('target').setDescription('The user'))
            .addStringOption(option => option.setName('str').setDescription('The string'))
        .addSubcommand(sub => sub
            .setName('test')
            .setDescription('test')
            .addUserOption(option => option.setName('target2').setDescription('The user'))
            .addStringOption(option => option.setName('str2').setDescription('The string'))
        ),

    async execute(interaction) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command test`);
        interaction.reply({ content: "just a test command", ephemeral: true });
    }
}