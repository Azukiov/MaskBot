const djs = require('discord.js');
const client = require('./imports/client.js');
const log = require('./imports/logger.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

log.start("-----------------------------------------------------------------------")
log.start("----------------------------Starting up ...----------------------------")
log.start("-----------------------------------------------------------------------")



require('./imports/db.js');
require('./handlers/events.js')
require('./handlers/commands.js')


try {
    client.login(process.env.DISCORD_TOKEN);

} catch (error) {
    log.error(error);
}