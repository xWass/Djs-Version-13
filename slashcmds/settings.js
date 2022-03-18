const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription("Modify the bot's settings in your guild.")

        .addStringOption((stringOption) => stringOption
            .setName('setting')
            .setDescription("Select \"ModConfirm\" to disable confirmation messages on moderation actions.")
            .addChoice('ModConfirm', 'confirms')
        )

        .addStringOption((stringOption) => stringOption
            .setName('modify')
            .setDescription('Enable or Disable?')
            .addChoice('Enable', 'enable')
            .addChoice('Disable', 'disable')
        ),

    async execute(interaction) {
        const set = interaction.options.getString('setting');
        const change = interaction.options.getString('change');


        const embed = new MessageEmbed()

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> You do not have the `BAN_MEMBERS` permission!')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        if (set !== "confirms") {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> An error has occured with this command.')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        if (change !== "enable" || change !== "disable") {
            embed.setColor('DARK_RED')
            embed.setDescription('<:Error:949853701504372778> An error has occured with this command.')
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        embed.setColor('GREEN')
        embed.setTitle(`Update a setting?`)
        embed.setDescription(`Are you sure you want to update this setting?`)

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
            embed.setTitle('Interaction timed out!')
            embed.setDescription('The response time for the command has expired')
            embed.setFooter('Enter the command again')
            await interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        await response.update({ components: [row] });

        if (response.customId === 'yes') {
            if (change === "enable") {
                //update to enable here
                console.log("L")
            } else if (change === "disable") {
                //update to disable here
                console.log("L")
            }
            // run the code to change where guildId = interaction.guild.id

            embed.setColor('GREEN')
            embed.setTitle('Setting updated!')
            embed.setDescription('<:Success:949853804155793450> You will no longer see confirmation messages when you run a moderator command.')
            embed.setFooter('You can use another command')



            await interaction.followUp({ embeds: [embed], ephemeral: true });


        } else {
            embed.setColor('GREEN')
            embed.setTitle('Cancelled!')
            embed.setDescription('<:Success:949853804155793450> The command was successfully cancelled')
            embed.setFooter('You can use another command')
            await interaction.followUp({ embeds: [embed], ephemeral: true });
    
        }
    }
}