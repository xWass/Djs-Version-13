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
        .setName('softban')
        .setDescription('Select a member and ban them.')

        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to softban. (Clears past 7 days of their messages)'))

        .addStringOption(option => option
            .setName('invite')
            .setDescription('Invite the user back? (y/n)')),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const mem = interaction.options.getMember('user');
        const inv = interaction.options.getString('invite');

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
            embed.setTitle(`I can not softban ${user.tag}`)
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
        embed.setTitle(`Are you sure you want to softban ${user.tag}?`)
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
            if (inv === null) {
                embed.setTitle(`${user.tag} softbannned \nModerator: ${interaction.user.tag}`)
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })
                await interaction.guild.bans.remove(user.id)
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: false
                });
            } else if (inv === "y") {
                let invite = await interaction.channel.createInvite({
                    maxAge: 604800,
                    maxUses: 1
                })
                // await send invite here
                embed.setTitle(`You were softbanned from a server. Heres an invite back: \n${invite}`)
                await user.send({
                    embeds: [embed],
                    ephemeral: false
                })
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })
                await interaction.guild.bans.remove(user.id)
                embed.setTitle(`${user.tag} softbanned. \nModerator: ${interaction.user.tag} \nThis user was invited back`)
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: false
                });
                return;
            } else if (inv === "n") {
                embed.setTitle(`${user.tag} softbanned \nModerator: ${interaction.user.tag} \nThis user was not invited back`)
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })
                await interaction.guild.bans.remove(user.id)
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: false
                });
                return;
            } else {
                embed.setTitle(`${user.tag} softbanned \nModerator: ${interaction.user.tag} \nThis usser was not reinvited`)
                await interaction.guild.members.ban(user.id, {
                    days: 7
                })
                await interaction.guild.bans.remove(user.id)
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: false
                });
                return;

            }
        } else
            embed.setTitle("Interaction cancelled!")
        await interaction.followUp({
            embeds: [embed],
            ephemeral: true
        });
    }
}
