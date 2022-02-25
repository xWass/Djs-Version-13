const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton
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

        if (!interaction.member.permissions.has('MANAGE_MESSAGES'))
            return void (await interaction.reply({
                content: 'You do not have the `Manage Messages` permission.',
                ephemeral: true
            }));

        if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES'))
            return void (await interaction.reply({
                content: 'I do not have the `Manage Messages` permission.',
                ephemeral: true
            }));

        if (amount === null)
            return void (await interaction.reply({
                content: 'You did not specify a number of messages to clear.',
                ephemeral: true
            }));



            

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
        await interaction.reply({
            content: `Are you sure you want to clear ${amount} messages?`,
            components: [row],
            ephemeral: true
        });
        const response = await interaction.channel
            .awaitMessageComponent({
                filter: (i) => {
                    const isInteractionUser = i.user.id === interaction.user.id;
                    if (!isInteractionUser) {
                        i.followUp({
                            content: "You can't use this!",
                            ephemeral: true
                        });
                        return false;
                    }
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    return i.customId === 'yes' || i.customId === 'no';
                },
                time: 15000
            })
            .catch(() => null);
        if (response === null)
            return void (await interaction.followUp({
                content: 'Time out! Operation cancelled.',
                ephemeral: true
            }));
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({
            components: [row]
        });
        if (response.customId === 'yes') {
            await interaction.channel.bulkDelete(amount);

            await interaction.followUp({
                content: `${amount} messages cleared.`,
                ephemeral: false
            });
        } else
            await interaction.followUp({
                content: 'Cancelled!',
                ephemeral: true
            });
    }
}
