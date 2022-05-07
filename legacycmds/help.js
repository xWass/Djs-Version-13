const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: "help",
    usage: "help",
    description: "Displays help message",
    async execute(client, message, args) {

        console.log(chalk.greenBright('[EVENT ACKNOWLEDGED]') + ` messageCreate with command help`);

        const embed = new MessageEmbed()
        const altEmbed = new MessageEmbed()
        embed.setColor('GREEN')
        embed.setTitle('Bot Commands')
        embed.addFields(
            { name: `Ban`, value: `Bans a mentioned user. \nUsage: \n\`\`\`.ban <@member>\`\`\``, inline: true },
            { name: `Bot`, value: `Displays information about the bot. \nUsage: \n\`\`\`.bot\`\`\``, inline: true },
            { name: `Clear`, value: `Bulk deletes messages from a channel. \nUsage: \n\`\`\`.clear <amount>\`\`\``, inline: true },
            { name: `Contributers`, value: `Displays active contributers bot the bot's code. \nUsage: \n\`\`\`.contributers\`\`\``, inline: true },
            { name: `Kick`, value: `Kicks a mentioned user. \nUsage: \n\`\`\`.kick <@member>\`\`\``, inline: true },
            { name: `Mute`, value: `Mutes a mentioned user. \nUsage: \n\`\`\`.mute <@member> <duration [1min, 1h, 1d]>\`\`\``, inline: true },
            { name: `Server Info`, value: `Displays information about the server. \nUsage: \n\`\`\`.serverinfo\`\`\``, inline: true },
            { name: `Unmute`, value: `Unmutes a mentioned user. \nUsage: \`\`\`.unmute <@member>\`\`\``, inline: true },
            { name: `User Info`, value: `Dislays information about you or a mentioned user. \nUsage: \n\`\`\`.userinfo [@member]\`\`\``, inline: true }
        )
        embed.setFooter('Thanks for using me!')

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('⚙️')
                    .setStyle('SUCCESS')
            );
        altEmbed.setTitle('You recieved mail!')
        altEmbed.setFooter('Thanks for using me!')
        altEmbed.setColor('GREEN')
        await message.reply({ embeds: [altEmbed] })
        const dm = await message.member
            .send({ embeds: [embed], components: [row] })
            .catch((err) => {
                altEmbed.setTitle('Never mind! It appears your dms are closed.')
                altEmbed.setDescription(`Error: \n\`\`\`${err.toString()}\`\`\``)
                altEmbed.setFooter('Thanks for using me!')
                altEmbed.setColor('RED')
                message.channel.send({ embeds: [altEmbed] })
                return;
            });
        const interaction_ = await dm.channel
            .awaitMessageComponent({
                filter: (i) => i.customId === 'yes',
                time: 15_000
            })
            .catch(() => null);

        if (interaction_ === null) {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            dm.edit({ components: [row] })
            return;
        }

        for (const component_ of row.components)
            if (!component_.disabled)
                component_.setDisabled(true);

        await interaction_.update({ components: [row] });


        if (interaction_.customId === 'yes') {
            altEmbed.setColor('GREEN')
            altEmbed.setTitle('Settings')
            altEmbed.addFields(
                { name: `Confirmation on Moderation Commands`, value: `Enables or disables the confirmation messages on moderation commands. \nUsage: \nType /settings and navigate through the options`, inline: true }
            )
            await message.member.send({ embeds: [altEmbed] });
        }
    }
}
