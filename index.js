const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require("dotenv").config();
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { clientId, guildId } = require('./config.json');

for (const file of commandFiles) {
    let command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const commands = [];

client.once('ready', async () => {
	let one = client.guilds.cache.get(guildId)
    console.log('Started refreshing application (/) commands.');
	await client.application.commands.set(commands);
    console.log('Successfully reloaded application (/) commands.');
    console.log('Ready!')
});

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