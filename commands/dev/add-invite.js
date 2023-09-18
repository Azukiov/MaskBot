const djs = require('discord.js');
const log = require('../../imports/logger.js');
const db = require('../../imports/db.js');

module.exports = {
    module: 'dev',
    data: new djs.SlashCommandBuilder()
        .setName('add-invite')
        .setDescription('Create an invite for the server id and add it to the database.')
        .addStringOption(option => option.setName('id')
            .setDescription('The id of the server to create an invite for.')
            .setRequired(true)
        ),
    async execute(client, interaction) {
        const id = interaction.options.getString('id');
        // check if the bot is on the server id
        const guild = client.guilds.cache.get(id);

        if (!guild) {
            return interaction.reply({
                content: 'The bot is not on that server.',
                ephemeral: true
            });
        } else {
            const channel = guild.channels.cache.filter(channel => channel.type === djs.ChannelType.GuildText).first();
            const invite = await channel.createInvite({
                maxAge: 0,
                maxUses: 0,
            });
            log.dev(`Created invite ${invite.code} for ${guild.name} by ${interaction.user.tag} (${interaction.user.id})`);
            // add the server to the database
            await db.query(`INSERT INTO invites (id, invite) VALUES ('${guild.id}', '${invite.code}')`)
            interaction.reply({
                content: `Created invite ${invite.code} for ${guild.name}.`,
                ephemeral: true
            });
        }

    }
}