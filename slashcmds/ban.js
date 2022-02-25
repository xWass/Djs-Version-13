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
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The member to ban')),
    async execute(interaction) {

        const user = interaction.options.getUser('user');
		const mem = interaction.options.getMember('user');

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            embed.setTitle("You do not have the `BAN_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
            embed.setTitle("I do not have the `BAN_MEMBERS` permission!")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return;
        }

        if (!mem.bannable) {
            embed.setTitle(`I can not baan ${user.tag}`)
            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
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
            embed.setTitle(`Are you sure you want to ban ${user.tag}?`)
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
            return;
        }
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({
            components: [row]
        });
        if (response.customId === 'yes') {
			await interaction.guild.members.ban(user.id)
            embed.setTitle(`${user.tag} banned. \nModerator: ${interaction.user.tag}`)
            await interaction.followUp({
                embeds: [embed],
                ephemeral: false
            });
        } else {
            embed.setTitle("Cancelled!")
            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}