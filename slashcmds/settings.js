const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Modify the bot's settings in your guild.")

        .addStringOption((stringOption) => stringOption
            .setName("setting")
            .setDescription("Select \"ModConfirm\" to disable confirmation messages on moderation actions.")
            .addChoice("ModConfirm", "confirms")
            .setRequired(true)
        )

        .addStringOption((stringOption) => stringOption
            .setName("modify")
            .setDescription("Enable or Disable?")
            .addChoice("Enable", "enable")
            .addChoice("Disable", "disable")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const set = interaction.options.getString("setting");
        const change = interaction.options.getString("modify");


        const embed = new MessageEmbed()

        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            embed.setColor("DARK_RED")
            embed.setDescription("<:Error:949853701504372778> You do not have the `BAN_MEMBERS` permission!")
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        embed.setColor("GREEN")
        embed.setTitle(`Update a setting?`)
        embed.setDescription(`Are you sure you want to update this setting?`)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("yes")
                    .setLabel("Confirm")
                    .setStyle("SUCCESS")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("no")
                    .setLabel("Cancel")
                    .setStyle("DANGER")
            );
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const response = await interaction.channel
            .awaitMessageComponent({
                filter: (i) => {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    return i.customId === "yes" || i.customId === "no";
                },
                time: 15000
            })
            .catch(() => null);
        if (response === null) {
            embed.setColor("DARK_RED")
            embed.setTitle("Interaction timed out!")
            embed.setDescription("The response time for the command has expired")
            embed.setFooter("Enter the command again")
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            await interaction.editReply({ components: [row] });
            await interaction.followUp({ embeds: [embed], ephemeral: true })
            return;
        }


        if (response.customId === "yes") {
            let id = interaction.guild.id
            let found = await client.db.collection("settings").findOne({ guildid: id })
            if (!found) {
                await client.db.collection("settings").insertOne({ guildid: id })
            }
            if (change === "enable") {
                //update to enable here
                await client.db.collection("settings").updateOne({ guildid: id }, { $set: { enabled: true } })

                embed.setColor("GREEN")
                embed.setTitle("Setting updated!")
                embed.setDescription("<:Success:949853804155793450> You will see confirmation messages when you run a moderator command.")
                embed.setFooter("You can use another command")

                await interaction.followUp({ embeds: [embed], ephemeral: true });
                return;
            } else if (change === "disable") {
                await client.db.collection("settings").updateOne({ guildid: id }, { $set: { enabled: false } })

                //update to disable here
                embed.setColor("GREEN")
                embed.setTitle("Setting updated!")
                embed.setDescription("<:Success:949853804155793450> You will no longer see confirmation messages when you run a moderator command.")
                embed.setFooter("You can use another command")

                await interaction.followUp({ embeds: [embed], ephemeral: true });
                return;
            }
        } else {
            embed.setColor("GREEN")
            embed.setTitle("Cancelled!")
            embed.setDescription("<:Success:949853804155793450> The command was successfully cancelled")
            embed.setFooter("You can use another command")
            await interaction.followUp({ embeds: [embed], ephemeral: true });

        }
    }
}