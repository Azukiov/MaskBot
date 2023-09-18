const fs = require('fs');
const path = require('path');
const djs = require('discord.js');
const client = require('../imports/client.js');
const log = require('../imports/logger.js');


client.commands = new djs.Collection();
const commands = []
const foldersPath = path.join(__dirname, '../commands');

fs.readdirSync(foldersPath).forEach(folder => {
    fs.readdirSync(`${foldersPath}/${folder}`).filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(`${foldersPath}/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            log.load(`Loaded slash command ${command.data.name} from ${file}`);
        } else {
            log.error(`Failed to load slash command ${file}`);
        }
    })
})

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on(djs.Events.ClientReady, async (client) => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        log.load(`Successfully pushed ${commands.length} slash commands.`);
    } catch (error) {
        log.error(error);
        console.error(error);
    }
})