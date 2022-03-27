// ⚙️
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: "help",
    usage: "help",
    description: "Displays help message",
    async execute(client, message, args) {

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
        await message.member
            .send({ embeds: [embed], components: [row] })
            .catch((err) => {
                altEmbed.setTitle('Never mind! It appears your dms are closed.')
                altEmbed.setDescription(`Error: \n\`\`\`${err.toString()}\`\`\``)
                altEmbed.setFooter('Thanks for using me!')
                altEmbed.setColor('RED')
    
                message.channel.send({ embeds: [altEmbed] })
    
            });
        const response = await message.channel
            .awaitMessageComponent({
                filter: (i) => {
                    const isInteractionUser = i.user.id === message.member.id;

                    if (!isInteractionUser) {
                        return false;
                    }
                    row.components[0].setDisabled(true);
                    return i.customId === 'yes';
                },
                time: 15000
            })
            .catch(() => null);
        if (response === null) {
            return;
            //me when
        }

        row.components[0].setDisabled(true);
        await response.update({ components: [row] });

        if (response.customId === 'yes') {
            altEmbed.setColor('GREEN')
            altEmbed.setTitle('Settings')
            altEmbed.addFields(
                { name: `Confirmation on Moderation Commands`, value: `Enables or disables the confirmation messages on moderation commands. \nUsage: \nType /settings and navigate through the options`, inline: true }
            )
            await message.member.send({ embeds: [embed] });
        }
    }
}

