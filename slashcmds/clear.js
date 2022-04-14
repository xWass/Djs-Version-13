const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear an amount of messages from a channel')
        .addIntegerOption((option) => option
            .setName('amount')
            .setRequired(true)
            .setDescription('The number of messages to clear! 1-100')),
    async execute(interaction, client) {
        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` interactionCreate with command clear`);
        let id = interaction.guild.id
        const amount = interaction.options.getInteger('amount');
        const embed = new MessageEmbed()
        const settings = await client.db.collection("settings").findOne({ guildid: id })

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `MANAGE_MESSAGES` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> I do not have the `MANAGE_MESSAGES` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        if (amount === null) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You did not specify a number of messages to clear!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        if (settings.enabled) {
            embed.setColor('GREEN')
            embed.setTitle('Clear Messages?')
            embed.setDescription(`Are you sure you want to clear **${amount}** messages?`)

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('yes')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('no')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                );
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

            const response = await interaction.channel
                .awaitMessageComponent({
                    filter: (i) => {
                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(true);
                        return i.customId === 'yes' || i.customId === 'no';
                    },
                    time: 15000
                })
                .catch(() => null);


            if (response === null) {
                embed.setColor('DARK_RED')
                embed.setTitle("Interaction timed out!")
                embed.setDescription('The response time for the command has expired')
                embed.setFooter('Enter the command again please')
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await interaction.editReply({ components: [row] });
                await interaction.followUp({ embeds: [embed], ephemeral: true })
            }


            if (response.customId === 'yes') {
                embed.setColor('GREEN')
                embed.setTitle('I successfully deleted the messages')
                embed.setDescription(`Amount: **${amount}**\nModerator: **${interaction.user.tag}**`)
                embed.setFooter('Thanks for using me!')
                await interaction.channel.bulkDelete(amount);

                await interaction.followUp({ embeds: [embed], ephemeral: false });
            } else {
                embed.setColor('DARK_RED')
                embed.setTitle("Interaction cancelled!")
                embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
                embed.setFooter('You can use another command')

                await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
        } else {
            embed.setColor('GREEN')
            embed.setTitle('I successfully deleted the messages')
            embed.setDescription(`Amount: **${amount}**\nModerator: **${interaction.user.tag}**`)
            embed.setFooter('Thanks for using me!')
            await interaction.channel.bulkDelete(amount);

            await interaction.reply({ embeds: [embed], ephemeral: false });

        }
    }
}
