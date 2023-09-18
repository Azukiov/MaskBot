const djs = require('discord.js');

module.exports = {
    module: 'informations',
    data: new djs.SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get some stats')
        .addSubcommand(subcommand => subcommand.setName('bot')
            .setDescription('Get some stats about the bot.'))
        ,
    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'bot') {
            const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
            const guilds = client.guilds.cache.size;
            const name = client.user.tag;

            const embed = new djs.EmbedBuilder()
                .setAuthor({ name: `${name} Stats`, iconURL: client.user.displayAvatarURL(), url: process.env.INVITE_LINK})
                .setThumbnail(client.user.displayAvatarURL())
                .addFields(
                    { name: 'Users', value: `${users}`, inline: true },
                    { name: 'Guilds', value: `${guilds}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Made with ❤️ by azukiov`})
                .setColor(process.env.COLOR);

            console.log()

            interaction.reply({ embeds: [embed] });
        }
    }
}