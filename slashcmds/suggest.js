const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const chalk = require('chalk');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion'),

    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('suggest')
            .setTitle('Suggestions');

        // text input components
        const shortDescription = new TextInputComponent()
            .setCustomId('descrip')
            .setLabel("Enter a brief description here.")
            .setStyle('SHORT')
        const longDescription = new TextInputComponent()
            .setCustomId('descrip2')
            .setLabel("Enter a longer description here.")
            .setStyle('PARAGRAPH');
        const userid = new TextInputComponent()
            .setCustomId('id')
            .setLabel("Enter your user ID here.")
            .setStyle('SHORT');

        const first = new MessageActionRow().addComponents(shortDescription);
        const second = new MessageActionRow().addComponents(longDescription);
        const third = new MessageActionRow().addComponents(userid);

        modal.addComponents(first, second, third);

        await interaction.showModal(modal);
    }
}
