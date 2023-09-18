const djs = require('discord.js');
const log = require('../imports/logger.js');
const alert = require('../imports/alerts.js');

module.exports = {
    name: djs.Events.InteractionCreate,
    async execute(interaction) {
        let client = interaction.client;

        if (!interaction.isChatInputCommand()) return;

        let command = client.commands.get(interaction.commandName);

        if (!command) {
            log.error(`301 - Command ${interaction.commandName} not found.`);
            alert.cmd({ code: '301', command: interaction.commandName, guild: interaction.guild.id, user: interaction.user.id })
            interaction.reply({ content: `An error occurred while using the command\nPlease send a message to [support](https://discord.gg/YfdEgx5yzF) with error code: \`301\``, ephemeral: true });
            return;
        }

        try {
            await command.execute(client, interaction);
            log.cmd(`${interaction.user.id} used command ${interaction.commandName} in ${interaction.guild.id}`)
        } catch (error) {
            log.error(`Command ${interaction.commandName} failed to execute.`);
            alert.cmd({ error: error, command: interaction.commandName, guild: interaction.guild.id, user: interaction.user.id })
            interaction.reply({ content: `An error occurred while using the command\nPlease send a message to [support](https://discord.gg/YfdEgx5yzF)`, ephemeral: true });
            console.error(error);
        }
    }
}