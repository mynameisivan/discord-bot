const firstMessage = require('../modules/firstMessage')

module.exports = async (client) => { 

    const channelId = '797391761948409856'
    const getEmoji = emojiName => 
        client.emojis.cache.find((emoji) => emoji.name === emojiName)

    const emojis = {
        fuckValorant: 'CS:GO',
        gotRice: 'Tarkov',
        smokeTrees: 'Apex',
        passTheAWP: 'Ivan'
    }

    const reactions = []

    //TODO: maybe add this as an embed
    let emojiText = 'Welcome to TNY!\nWe are chill group of homies who suck at games.\nYou\'ll usually catch us playing our main squeeze: Counter-Strike, but we also play other FPS games and party games!\n\nThese roles are focused on the many games we play in this discord.\nPlease react to the corresponding role and you will be added to that game\'s role and will be notified with an \'@\' in the chat when anyone is looking for a party.\nPlease remember use the \'@\' symbol followed by the game role when you are looking for a party!\n\n'
    for (const key in emojis) {
        const emoji = getEmoji(key)
        reactions.push(emoji)

        const role = emojis[key]
        emojiText += `${emoji} = ${role}\n`
    }

    firstMessage(client, channelId, emojiText, reactions)

    const handleReaction = (reaction, user, add) => {
        if (user.id === '797593116529000468') {
            return
        }


        const emoji = reaction._emoji.name

        const { guild } = reaction.message

        const roleName = emojis[emoji]
        if (!roleName) {
            return 
        }

        const role = guild.roles.cache.find(role => role.name === roleName)
        const member = guild.members.cache.find(member => member.id === user.id)

        if (add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId){
            handleReaction(reaction, user, true)
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId){
            handleReaction(reaction, user, false)
        }
    })

};

  