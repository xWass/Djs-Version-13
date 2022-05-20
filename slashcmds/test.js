const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('test')
        .addSubcommand(sub =>
            sub
                .setName('modconfirm')
                .setDescription('Enables or disables confirmation messages on moderation actions.')
                .addStringOption((stringOption) =>
                    stringOption
                        .setName("modify")
                        .setDescription("Enable or Disable?")
                        .addChoice("Enable", "enable")
                        .addChoice("Disable", "disable")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('prefix')
                .setDescription('Changes the prefix of the bot in your server.')
                .addStringOption(option =>
                    option
                        .setName('prefix')
                        .setDescription('The new prefix.')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command test`);
        let chosen = await interaction.options.getSubcommand()
        if (chosen === 'modconfirm') {
            const change = interaction.options.getString("modify");
            interaction.channel.send({ content: `${change}`, ephemeral: true });

        } else {
            const prefix = interaction.options.getString("prefix");
            interaction.channel.send({ content: `${prefix}`, ephemeral: true });
        }
    }
}