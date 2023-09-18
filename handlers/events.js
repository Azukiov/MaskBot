const fs = require("fs");
const log = require("../imports/logger.js");
const client = require("../imports/client.js");

fs.readdirSync('./events').filter(file => file.endsWith('.js')).forEach(file => {
    const event = require(`../events/${file}`);
    if ('name' in event && 'execute' in event) {
        client.on(event.name, (...args) => event.execute(...args, client));
        log.load(`Loaded event ${event.name}`);
    } else {
        log.error(`Event ${file} is missing a name or execute function`);
    }
});

log.load(`Loaded ${fs.readdirSync('./events').length} events.`);