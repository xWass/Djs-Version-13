const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

const ms = require('ms')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Select a member and mute them.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to mute.'))
        .addStringOption(option => option
            .setName('time')
            .setDescription('Time to mute for. (1m, 1h, 1d, 1w. 28 days max)')),
    async execute(interaction) {

        const user = await interaction.options.getUser('user') || null
        const mem = await interaction.options.getMember('user') || null
        const t = await interaction.options.getString('time') || null
        const tt = ms(t)
        if (!interaction.member.permissions.has('MODERATE_MEMBERS'))
            return void (await interaction.reply({
                content: 'You do not have the `TIMEOUT_MEMBERS` permission.',
                ephemeral: true
            }));

        if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS'))
            return void (await interaction.reply({
                content: 'I do not have the `TIMEOUT_MEMBERS` permission.',
                ephemeral: true
            }));

        if (!mem.moderatable) {
            interaction.reply({
                content: `I can not mute ${user.tag}.`,
                ephemeral: false,
            })
            return;
        }
        if (t === null)
            return void (await interaction.reply({
                content: 'You failed to provide a mute duration.',
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
            content: `Are you sure you want to mute ${user.tag}?`,
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
            await mem.timeout(tt)
            await interaction.followUp({
                content: `${user} muted.`,
                ephemeral: false
            });
        } else
            await interaction.followUp({
                content: 'Cancelled!',
                ephemeral: true
            });
    }
}