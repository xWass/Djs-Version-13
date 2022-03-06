const fs = require('fs');
const chalk = require('chalk');
const { Client, Collection, Intents } = require('discord.js');
//const MongoClient = require('mongodb').MongoClient
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

const { clientId, guildId, prefix } = require('./config.json');

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

/*
const databaseConnect = async () => {
    const mongoClient = new MongoClient(process.env.MONGO);
    await mongoClient.connect()
    const database = mongoClient.db("database name")
    client.db = database;
    console.log("Connected to the database!")
}
*/

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log(chalk.redBright('New version of the bot made by DEEM#0001'))
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
    //databaseConnect()
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.SlashCommands.get(interaction.commandName);

    if (!command) return;
    console.log(chalk.yellowBright('[EVENT FIRED]') + ` interactionCreate with command ${interaction.commandName}`);
    try {
        await command.execute(interaction);
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
    if (message.author.bot) return
    if (!message.content.startsWith("<@" + client.user.id + ">") && !message.content.startsWith("<@!" + client.user.id + ">") && !message.content.startsWith(prefix)) { return }
    let split = message.content.split(" ");
    let search = split[1]
    if (message.content.startsWith(prefix)) search = split[0].slice(prefix.length)
    let command = client.LegacyCommands.get(search) || client.LegacyCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(search));
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