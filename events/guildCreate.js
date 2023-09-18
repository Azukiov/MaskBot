const djs = require('discord.js');
const log = require('../imports/logger.js');
const db = require('../imports/db.js');

module.exports = {
    name: djs.Events.GuildCreate,
    async execute(guild) {
        // create a new invite when the bot joins a server
        const channel = guild.channels.cache.filter(channel => channel.type === djs.ChannelType.GuildText).first();
        const invite = await channel.createInvite({
            maxAge: 0,
            maxUses: 0,
        });
        log.debug(`Created invite ${invite.code} for ${guild.name}`);
        // add the server to the database
        await db.query(`INSERT INTO invites (id, invite) VALUES ('${guild.id}', '${invite.code}')`)
        
        await db.query(`INSERT INTO captcha (guild, channel, role, enabled, timeout) VALUES ('${guild.id}', '', '', false, 180)`)
    }
}