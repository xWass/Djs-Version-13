const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const MongoClient = require('mongodb').MongoClient
const intents = new Intents();
intents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
);

const client = new Client({ intents: intents, partials: ["MESSAGE", "REACTION"], allowedMentions: { parse: ["users"] } });
require("dotenv").config();
client.LegacyCommands = new Collection();
client.SlashCommands = new Collection();
const commandFiles = fs.readdirSync('./slashcmds').filter(file => file.endsWith('.js'));
const legFiles = fs.readdirSync('./legacycmds').filter(file => file.endsWith('.js'));

const { clientId, guildId } = require('./config.json');
const prefix = "."

process.on('unhandledRejection', error => {
    console.log(error);
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [];
for (const file of commandFiles) {
    const command = require(`./slashcmds/${file}`);
    commands.push(command.data.toJSON());
}

// DB HERE
const databaseConnect = async () => {
    const mongoClient = new MongoClient(process.env.MONGO);
    await mongoClient.connect()
    const database = mongoClient.db("Diomedes")
    client.db = database;
    console.log("Connected to the database!")
}


const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log(chalk.yellowBright('Started refreshing application [/] commands.'));

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(chalk.greenBright('Successfully reloaded application [/] commands.'));
    } catch (error) {
        console.error(error)
    }
})();

client.on("ready", async () => {
    databaseConnect()
    client.user.setActivity(`Slash Commands!`, { type: "LISTENING" })
});

client.once('ready', async () => {
    for (const file of commandFiles) {
        console.log(chalk.yellowBright('[SLASH COMMAND LOADED]') + ` ${file}`);
    }
    for (const file of legFiles) {
        console.log(chalk.yellowBright('[LEGACY COMMAND LOADED]') + ` ${file}`);
    }
    console.log(chalk.greenBright('Ready!'))
});
for (const file of commandFiles) {
    let command = require(`./slashcmds/${file}`);
    client.SlashCommands.set(command.data.name, command);
}

client
    .on("debug", console.log)
    .on("warn", console.log)
client.on("rateLimit", console.log)

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    let id = interaction.guild.id
    let found = await client.db.collection("settings").findOne({ guildid: id })
    if (!found) {
        await client.db.collection("settings").insertOne({ guildid: id, enabled: true })
    }
    const command = client.SlashCommands.get(interaction.commandName);

    if (!command) return;
    console.log(chalk.yellowBright('[EVENT FIRED]') + ` interactionCreate with command ${interaction.commandName}`);
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: `${error}`, ephemeral: true });
    }
});
for (const file of legFiles) {
    const cmd = require(`./legacycmds/${file}`);
    client.LegacyCommands.set(cmd.name, cmd)
}

client.on("messageCreate", async (message) => {
    await axios({
        method: 'post',
        url: 'https://anti-fish.bitflow.dev/check',
        data: {
            message: message.content
        },
        headers: { "User-Agent": "Diomedes (Moderation Bot)" }
    })
        .then(async response => {
            if (response.data.match) {
                if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
                if (!message.guild.me.permissions.has("KICK_MEMBERS")) return;
                console.log(chalk.redBright(`[SCAM LINK] `) + ` ${message.content}`)
                let embed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setTitle("Scam Message Deleted!")
                    .setDescription(`${message.author.tag} sent a scam link and it was deleted.`)
                try {
                    if (!message.member.kickable) return;
                    await message.channel
                        .send({ embeds: [embed] })
                    await message.delete()
                    await message.member
                        .send({ embeds: [embed] })
                        .catch(() => undefined)
                    await message.member
                        .kick("Compromised account - sent scam link.")
                } catch (error) {
                    return;
                }

                embed.setTitle("You were kicked from a server because you sent a scam link. \nThis could mean your account has been compromised.")
                return;
            }
        })
        .catch(() => undefined);

    if (message.author.bot) return

    if (!message.content.startsWith(prefix)) return

    let split = message.content.split(" ");
    let search = split[1]
    if (message.content.startsWith(prefix)) search = split[0].slice(prefix.length)
    const command = client.LegacyCommands.get(search)
    if (command === undefined) return;
    
    let i = 1;
    console.log(chalk.yellowBright('[EVENT FIRED]') + ` messageCreate with content: ${message.content}`);

    if (message.content.startsWith(prefix)) i++;
    while (i <= 2) {
        i++;
        split.shift();
    };
    try {
        await command.execute(client, message, split)
    } catch (err) {
        message.reply(err.toString());
        console.log(chalk.redBright('[ERROR]') + ` ${err}`);
    }
});

client.login(process.env.TOKEN);
