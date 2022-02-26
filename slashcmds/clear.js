const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear an amount of messages from a channel.')
        .addIntegerOption((option) => option
            .setName('amount')
            .setDescription('The number of messages to clear. 1-100')),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()


        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            embed.setTitle("You do not have the `MANAGE_MESSAGES` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) {
            embed.setTitle("I do not have the `MANAGE_MESSAGES` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (amount === null){
            embed.setTitle("You did not specify a number of messages to clear.")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

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
            embed.setTitle(`Are you sure you want to clear ${amount} messages?`)
        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
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
            embed.setTitle("Interaction timed out!")
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            })
        }
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({
            components: [row]
        });
        if (response.customId === 'yes') {
            embed.setTitle(`Messages purged \nAmount: ${amount} \nModerator: ${interaction.user.tag}`)
            await interaction.channel.bulkDelete(amount);

            await interaction.followUp({
                embeds: [embed],
                ephemeral: false
            });
        } else {
            embed.setTitle("Interaction cancelled!")
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}
