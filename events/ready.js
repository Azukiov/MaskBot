const djs = require('discord.js');
const log = require('../imports/logger.js');
const db = require('../imports/db.js');

module.exports = {
    name: djs.Events.ClientReady,
    async execute(client) {
        log.info(`Logged in as ${client.user.tag}`)


        // create a new table if dont exist 
        await db.query(`CREATE TABLE IF NOT EXISTS invites (
            id VARCHAR(255) PRIMARY KEY,
            invite VARCHAR(255)
            )`)
        await db.query(`CREATE TABLE IF NOT EXISTS captcha (
            guild VARCHAR(255) PRIMARY KEY,
            channel VARCHAR(255),
            role VARCHAR(255),
            timeout_enabled BOOLEAN DEFAULT FALSE,
            timeout INTEGER,
            setup BOOLEAN DEFAULT FALSE
            )`)

        // get all guilds
        const guilds = client.guilds.cache.map(guild => guild.id);
        // add one server by one to the database in captcha table if not exist
        guilds.forEach(async guild => {
            
        })


        client.user.setStatus('idle');
        client.user.setActivity('sleeping', { type: djs.ActivityType.Watching });
    }
}