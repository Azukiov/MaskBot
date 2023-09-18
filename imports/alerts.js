// fait en sorte que quand je mets un alert.error({code: 301, message: 'Command not found.', guild: interaction.guild.id, user: interaction.user.id}) dans un fichier, ça me renvoie un message d'erreur avec le code et le message

const djs = require('discord.js');
const errorDescription = require('../data/errors-fr.json')
const client = require('./client.js');
const db = require('./db.js');

// when i write alert.cmd(message: 'message', code: 'code', guild: 'guild', user: 'user') in a file, it sends me an error message with the code and the message in an embed in the channel in .env
module.exports = {
    cmd: async (options) => {
        let channel = await client.channels.fetch(process.env.ALERT_CHANNEL_ID);
        // if they have error
        if (options.error) {
            let embed = new djs.EmbedBuilder()
                .setTitle(`Command Error`)
                .setDescription(`Error: ${options.error}`)
                .addFields(
                    { name: 'Command', value: options.command },
                    { name: 'Guild', value: options.guild },
                    { name: 'User', value: options.user },
                )
                .setColor(process.env.COLOR_ERROR)
                .setTimestamp();

            const guild = await db.query(`SELECT * FROM invites WHERE id = '${options.guild}'`)
            if (guild.length > 0) {
                const button = new djs.ButtonBuilder()
                    .setStyle(djs.ButtonStyle.Link)
                    .setLabel('Guild invite')
                    .setURL(`https://discord.gg/${guild[0].invite}`)
                const actionRow = new djs.ActionRowBuilder()
                    .addComponents(button)
                channel.send({ embeds: [embed], components: [actionRow] })
            } else {
                channel.send({ embeds: [embed] })
            }
        } else {
            let embed = new djs.EmbedBuilder()
                .setTitle(`Command Error: ${options.code}`)
                .addFields(
                    { name: `Code error definition`, value: `${errorDescription[options.code]}` },
                    { name: 'Command', value: options.command },
                    { name: 'Guild', value: options.guild },
                    { name: 'User', value: options.user },
                )
                .setColor(process.env.COLOR_ERROR)
                .setTimestamp();

            const guild = await db.query(`SELECT * FROM invites WHERE id = '${options.guild}'`)
            if (guild.length > 0) {
                const button = new djs.ButtonBuilder()
                    .setStyle(djs.ButtonStyle.Link)
                    .setLabel('Guild invite')
                    .setURL(`https://discord.gg/${guild[0].invite}`)
                const actionRow = new djs.ActionRowBuilder()
                    .addComponents(button)
                channel.send({ embeds: [embed], components: [actionRow] })
            } else {
                channel.send({ embeds: [embed] })
            }
        }
    }
}