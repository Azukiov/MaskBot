const djs = require('discord.js');
const log = require('../../imports/logger.js');
const db = require('../../imports/db.js');
const emojis = require('../../utils/emojis.json');
const author = require('../../imports/author.js');

module.exports = {
    module: 'captcha',
    data: new djs.SlashCommandBuilder()
        .setName('captcha')
        .setDescription('Setup a captcha for your server.')
        .setDefaultMemberPermissions(djs.PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand.setName('channel')
            .setDescription('Activate the captcha for your server.')
            .addChannelOption(option => option.setName('channel')
                .setDescription('The channel where the captcha will be sent.')
                .addChannelTypes(djs.ChannelType.GuildText)
                .setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand.setName('role')
            .setDescription('Set the role that will be given to the user after completing the captcha.')
            .addRoleOption(option => option.setName('role')
                .setDescription('The role that will be given to the user after completing the captcha.')
                .setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand.setName('auto-kick')
            .setDescription('Automatically kick users that fail the captcha.')
            .addBooleanOption(option => option.setName('enabled')
                .setDescription('Whether or not to enable auto-kick.')
                .setRequired(true)
            )
            .addIntegerOption(option => option.setName('timeout')
                .setDescription('The amount of time in seconds before kicking the user (default 180s).')
                .setRequired(false)
            ))
        .addSubcommand(subcommand => subcommand.setName('activate')
            .setDescription('Activate the captcha for your server.'))
        .addSubcommand(subcommand => subcommand.setName('deactivate')
            .setDescription('Deactivate the captcha for your server.'))
        .addSubcommand(subcommand => subcommand.setName('show-config')
            .setDescription('Show the captcha configuration for your server.')),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();
        const channelOption = interaction.options.getChannel('channel');
        const roleOption = interaction.options.getRole('role');
        const enabledOption = interaction.options.getBoolean('enabled');
        const timeoutOption = interaction.options.getInteger('timeout') || 180;

        const guild = interaction.guild;

        if (subcommand === 'channel') {
            const channel = channelOption
            const dbChannel = await db.query(`SELECT channel FROM captcha WHERE guild = '${guild.id}'`)
            // check if the channel is already set
            if (dbChannel[0].channel === '') {
                await db.query(`UPDATE captcha SET channel = '${channel.id}' WHERE guild = '${guild.id}'`)
                log.db(`Successfully set the captcha channel to ${channel.id} by ${interaction.user.id} in ${guild.id}`)
                interaction.reply({ content: `${emojis.success} Successfully set the captcha channel to <#${channel.id}>`, ephemeral: true })
            } else {
                if (dbChannel[0].channel === channel.id) {
                    interaction.reply({ content: `${emojis.warn} The captcha channel is already set to <#${channel.id}>`, ephemeral: true })
                } else {
                    interaction.reply({ content: `${emojis.warn} The captcha channel has set to <#${dbChannel[0].channel}>\n Are you sure you want to change it? Write **yes** before 60 sec`, ephemeral: true })

                    const filter = m => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 2 });

                    collector.on('collect', async m => {
                        console.log(`Collected ${m.content}`);
                        if (m.content === 'yes') {
                            m.delete()
                            await db.query(`UPDATE captcha SET channel = '${channel.id}' WHERE guild = '${guild.id}'`)
                            log.db(`Successfully set the captcha channel to ${channel.id} by ${interaction.user.id} in ${guild.id}`)
                            interaction.editReply({ content: `${emojis.success} Successfully set the captcha channel to <#${channel.id}>`, ephemeral: true })
                        } else {
                            interaction.editReply({ content: `${emojis.denied} The captcha channel has not been set to <#${dbChannel[0].channel}>`, ephemeral: true })
                        }
                    })
                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.editReply({ content: `${emojis.denied} The captcha channel has not been set to <#${channel.id}>`, ephemeral: true })
                        }
                    })
                }
            }
        }

        if (subcommand === 'role') {
            const role = roleOption
            const dbRole = await db.query(`SELECT role FROM captcha WHERE guild = '${guild.id}'`)
            // check if the role is already set
            if (dbRole[0].role === '') {
                await db.query(`UPDATE captcha SET role = '${role.id}' WHERE guild = '${guild.id}'`)
                log.db(`Successfully set the captcha role to ${role.id} by ${interaction.user.id} in ${guild.id}`)
                interaction.reply({ content: `${emojis.success} Successfully set the captcha role to <@&${role.id}>`, ephemeral: true })
            } else {
                if (dbRole[0].role === role.id) {
                    interaction.reply({ content: `${emojis.warn} The captcha role is already set to <@&${role.id}>`, ephemeral: true })
                } else {
                    interaction.reply({ content: `${emojis.warn} The captcha role has set to <@&${dbRole[0].role}>\n Are you sure you want to change it? Write **yes** before 60 sec`, ephemeral: true })

                    const filter = m => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 2 });

                    collector.on('collect', async m => {
                        console.log(`Collected ${m.content}`);
                        if (m.content === 'yes') {
                            m.delete()
                            await db.query(`UPDATE captcha SET role = '${role.id}' WHERE guild = '${guild.id}'`)
                            log.db(`Successfully set the captcha role to ${role.id} by ${interaction.user.id} in ${guild.id}`)
                            interaction.editReply({ content: `${emojis.success} Successfully set the captcha role to <@&${role.id}>`, ephemeral: true })
                        } else {
                            interaction.editReply({ content: `${emojis.denied} The captcha role has not been set to <@&${dbRole[0].role}>`, ephemeral: true })
                        }
                    })
                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.editReply({ content: `${emojis.denied} The captcha role has not been set to <@&${role.id}>`, ephemeral: true })
                        }
                    })
                }
            }
        }

        if (subcommand === 'auto-kick') {
            const enabled = enabledOption
            const timeout = timeoutOption
            const dbTimeout = await db.query(`SELECT timeout_enabled FROM captcha WHERE guild = '${guild.id}'`)
            const dbTimeoutTime = await db.query(`SELECT timeout FROM captcha WHERE guild = '${guild.id}'`)
            // check if the timeout is already set
            if (dbTimeout[0].timeout_enabled === false) {
                await db.query(`UPDATE captcha SET timeout_enabled = '${enabled}' WHERE guild = '${guild.id}'`)
                await db.query(`UPDATE captcha SET timeout = '${timeout}' WHERE guild = '${guild.id}'`)
                log.db(`Successfully set the captcha timeout to ${timeout} by ${interaction.user.id} in ${guild.id}`)
                interaction.reply({ content: `${emojis.success} Successfully set the captcha timeout to ${timeout} seconds`, ephemeral: true })
            } else {
                if (dbTimeout[0].timeout_enabled === enabled) {
                    interaction.reply({ content: `${emojis.warn} The captcha timeout is already set to ${dbTimeoutTime[0].timeout} seconds`, ephemeral: true })
                } else {
                    interaction.reply({ content: `${emojis.warn} The captcha timeout has set to ${dbTimeoutTime[0].timeout} seconds\n Are you sure you want to change it? Write **yes** before 60 sec`, ephemeral: true })

                    const filter = m => m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 2 });

                    collector.on('collect', async m => {
                        console.log(`Collected ${m.content}`);
                        if (m.content === 'yes') {
                            m.delete()
                            await db.query(`UPDATE captcha SET timeout_enabled = '${enabled}' WHERE guild = '${guild.id}'`)
                            await db.query(`UPDATE captcha SET timeout = '${timeout}' WHERE guild = '${guild.id}'`)
                            log.db(`Successfully set the captcha timeout to ${timeout} by ${interaction.user.id} in ${guild.id}`)
                            interaction.editReply({ content: `${emojis.success} Successfully set the captcha timeout to ${timeout} seconds`, ephemeral: true })
                        } else {
                            interaction.editReply({ content: `${emojis.denied} The captcha timeout has not been set to ${dbTimeoutTime[0].timeout} seconds`, ephemeral: true })
                        }
                    })
                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.editReply({ content: `${emojis.denied} The captcha timeout has not been set to ${timeout} seconds`, ephemeral: true })
                        }
                    })
                }
            }
        }


        if (subcommand === 'activate') {
            // check if setup is 0
            const dbSetup = await db.query(`SELECT setup FROM captcha WHERE guild = '${guild.id}'`)
            if (dbSetup[0].setup !== 0) {
                interaction.reply({ content: `${emojis.denied} The captcha is already activated`, ephemeral: true })
            } else {
                // check if channel is set
                const dbChannel = await db.query(`SELECT channel FROM captcha WHERE guild = '${guild.id}'`)
                if (dbChannel[0].channel === '') {
                    interaction.reply({ content: `${emojis.denied} The captcha channel is not set`, ephemeral: true })
                } else {
                    // check if role is set
                    const dbRole = await db.query(`SELECT role FROM captcha WHERE guild = '${guild.id}'`)
                    if (dbRole[0].role === '') {
                        interaction.reply({ content: `${emojis.denied} The captcha role is not set`, ephemeral: true })
                    } else {
                        // check if timeout is set
                        const dbTimeout = await db.query(`SELECT timeout_enabled FROM captcha WHERE guild = '${guild.id}'`)
                        if (dbTimeout[0].timeout_enabled === false) {
                            interaction.reply({ content: `${emojis.denied} The captcha timeout is not set`, ephemeral: true })
                        } else {
                            await db.query(`UPDATE captcha SET setup = '1' WHERE guild = '${guild.id}'`)
                            log.db(`Successfully activated the captcha by ${interaction.user.id} in ${guild.id}`)
                            interaction.reply({ content: `${emojis.success} Successfully activated the captcha`, ephemeral: true })
                        }
                    }
                }
            }
        }

        if (subcommand === 'deactivate') {
            const dbSetup = await db.query(`SELECT setup FROM captcha WHERE guild = '${guild.id}'`)
            if (dbSetup[0].setup !== 1) {
                interaction.reply({ content: `${emojis.denied} The captcha is already deactivated`, ephemeral: true })
            } else {
                await db.query(`UPDATE captcha SET setup = '0' WHERE guild = '${guild.id}'`)
                log.db(`Successfully deactivated the captcha by ${interaction.user.id} in ${guild.id}`)
                interaction.reply({ content: `${emojis.success} Successfully deactivated the captcha`, ephemeral: true })
            }
        }

        if (subcommand === 'show-config') {
            const dbChannel = await db.query(`SELECT channel FROM captcha WHERE guild = '${guild.id}'`)
            const dbRole = await db.query(`SELECT role FROM captcha WHERE guild = '${guild.id}'`)
            const dbTimeout = await db.query(`SELECT timeout_enabled FROM captcha WHERE guild = '${guild.id}'`)
            const dbTimeoutTime = await db.query(`SELECT timeout FROM captcha WHERE guild = '${guild.id}'`)
            const dbSetup = await db.query(`SELECT setup FROM captcha WHERE guild = '${guild.id}'`)

            const channel = dbChannel[0].channel
            const role = dbRole[0].role
            const timeout = dbTimeout[0].timeout_enabled
            const timeoutTime = dbTimeoutTime[0].timeout
            const setup = dbSetup[0].setup

            const embed = new djs.EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle('Captcha configuration')
                .setDescription('Here is the captcha configuration for your server.')
                .addFields(
                    { name: 'Channel', value: `<#${channel}>`, inline: true },
                    { name: 'Role', value: `<@&${role}>`, inline: true },
                    { name: 'Timeout', value: `${timeout ? 'Enabled' : 'Disabled'}\n${timeout ? `${timeoutTime} seconds` : ''}`, inline: true },
                    { name: 'Captcha Statut', value: `${setup ? 'Activated' : 'Deactivated'}`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `Made with ❤️ by ${author.getAuthorName()}`, iconURL: author.getAuthorAvatar() })
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}