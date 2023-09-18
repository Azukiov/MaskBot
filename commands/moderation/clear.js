const djs = require('discord.js');
const log = require('../../imports/logger.js');

module.exports = {
    module: 'moderation',
    data: new djs.SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel.')
        .addIntegerOption(option => option.setName('amount')
            .setDescription('The amount of messages to clear.')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100))
        .setDefaultMemberPermissions(djs.PermissionFlagsBits.ManageMessages),
    async execute(client, interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'You must provide a number between 1 and 100.',
                ephemeral: true
            });
        }

        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: amount });
        await channel.bulkDelete(messages, true);
        log.debug(`Deleted ${amount} messages from ${channel.name} (${channel.id})`);
        interaction.reply({
            content: `Deleted ${amount} messages from ${channel.name}.`,
            ephemeral: true
        });
    }
}