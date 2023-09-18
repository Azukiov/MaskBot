const client = require('../imports/client.js')

module.exports = {
    getAuthorName() {
        return client.users.cache.get(process.env.AUTHOR_ID).username
    },
    getAuthorId() {
        return process.env.AUTHOR_ID
    },
    getAuthorTag() {
        return client.users.cache.get(process.env.AUTHOR_ID).tag
    },
    getAuthorAvatar() {
        return client.users.cache.get(process.env.AUTHOR_ID).avatarURL()
    }
}