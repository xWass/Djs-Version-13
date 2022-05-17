const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Modal, MessageActionRow, TextInputComponent } = require('discord.js');
const chalk = require('chalk');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateCaptchaString() {
    let str = '';

    for (let i = 0; i < 6; i++)
        str += `${letters[Math.floor(Math.random() * letters.length)]} `;

    return str;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion'),

    async execute(interaction) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command suggest`);

        const customid = generateCaptchaString();
        const modal = new Modal()
            .setCustomId(customid)
            .setTitle('Suggestions');

        // text input components
        const shortDescription = new TextInputComponent()
            .setCustomId('descrip')
            .setLabel("Enter a brief description here.")
            .setStyle('SHORT')
            .setPlaceholder('Keep this one short.')
            .setRequired(true);

        const longDescription = new TextInputComponent()
            .setCustomId('descrip2')
            .setLabel("Enter a detailed explanation here.")
            .setStyle('PARAGRAPH')
            .setPlaceholder('Give me all the details')
            .setRequired(true);

        const first = new MessageActionRow().addComponents(shortDescription);
        const second = new MessageActionRow().addComponents(longDescription);

        modal.addComponents(first, second);

        await interaction.showModal(modal);

        const filter = (interaction) => interaction.customId === customid;

        interaction.awaitModalSubmit({ filter, time: 150_000 })
            .then(async (modal) => {
                const embed = new MessageEmbed()
                const a = modal.fields.getTextInputValue('descrip')
                const b = modal.fields.getTextInputValue('descrip2')

                modal.reply({ content: "Your suggestion has been submitted!", ephemeral: true });

                let chan = interaction.guild.channels.cache.get("948680525235777576");

                // embed stuff
                embed.setTitle(`${a}`)
                embed.setDescription(`Detailed explanation: ${b}`)
                embed.setFooter({ text: `Suggestion submitted by ${interaction.author.username}`, iconURL: interaction.author.avatarURL() })
                embed.setColor("#00ff00")
                chan.send({ embeds: [embed] });

            })
            .catch(err => {return err});

    }
}
