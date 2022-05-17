const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const chalk = require('chalk');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion'),

    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('suggestt')
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

        const first = new MessageActionRow().addComponents(shortDescription);
        const second = new MessageActionRow().addComponents(longDescription);

        modal.addComponents(first, second);

        await interaction.showModal(modal);
        const filter = (interaction) => interaction.customId === 'suggestt';
        interaction.awaitModalSubmit({ filter, time: 300_000 })
        const a = interaction.fields.getTextInputValue('descrip')
        const b = interaction.fields.getTextInputValue('descrip2')
        console.log(a, b)
    }
}
