const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them.')
		.addUserOption(option => option.setName('user').setDescription('The member to kick')),
	async execute(interaction) {

		const user = interaction.options.getUser('user');
		const mem = interaction.options.getMember('user');

		if (!interaction.member.permissions.has([Permissions.FLAGS.KICK_MEMBERS])) {
			interaction.reply({
				content: "You do not have the `KICK_MEMBERS` permission.",
				ephemeral: true,
			})
			return;
		}
		let guild = interaction.guild
		if (!guild.me.permissions.has([Permissions.FLAGS.KICK_MEMBERS])) {
			interaction.reply({
				content: "I do not have the `KICK_MEMBERS` permission.",
				ephemeral: false,
			})
			return;
		}
		if (!mem.kickable) {
			interaction.reply({
				content: `I can not kick ${user.tag}.`,
				ephemeral: false,
			})
			return;
		}


		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('kick_yes')
					.setLabel('Confirm')
					.setStyle('SUCCESS')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('kick_no')
					.setLabel('Cancel')
					.setStyle('DANGER')
			)
		interaction.reply({
			content: `Are you sure you want to kick ${user.tag}?`,
			components: [row],
			ephemeral: true,
			fetchReply: true
		})

		const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.customId === 'kick_yes') {
					row.components[0].setDisabled(true)
					row.components[1].setDisabled(true)
					await i.update({
						content: `${user.tag} was kicked from the server.`,
						components: [row],
						ephemeral: false
					});
					interaction.guild.members.kick(user.id)
					return;
				}
				if (i.customId === 'kick_no') {
					row.components[1].setDisabled(true)
					await i.update({
						content: 'Canceled!',
						components: [],
						ephemeral: true
					});
					return;
				}
			}
			else {
				i.reply({
					content: `You can not use this!`,
					ephemeral: true
				});
			}
		})
	},
}