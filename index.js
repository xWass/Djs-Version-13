const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require("dotenv").config();
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { clientId, guildId } = require('./config.json');


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [];
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
	try {
		console.log(commands.map(c => c.name))
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error)
	}
})();
client.on("ready", async () => {
    client.user.setActivity(`hi xiuh from xwass`, { type: "WATCHING" })
});
client.once('ready', async () => {
	for (const file of commandFiles) {
		console.log(`Loaded ${file}!`);
	}
	console.log('Ready!')
});

for (const file of commandFiles) {
    let command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);
