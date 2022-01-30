const {Client, Intents} = require('discord.js');
require('dotenv').config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

/**
 * Ban users from the discord server
 * @param {GuildMember} name - id of the user to ban
 * @param {Number} amount - Number of days of ban
 * @return {boolean}
 */

const banuser = (name, amount) => {
    if(name.ban({days : amount})){
        return true;
    }else{
        return false;
    }
}

/**
 * Kick users from the discord server
 * @param {GuildMember} name - id of the user to kick
 * @return {boolean}
 */

const kickuser = (name) => {
    if(name.kick()){
        return true;
    }else{
        return false;
    }
}

/**
 * Rename user from the discord server
 * @param {GuildMember} member - member to rename
 * @param {string} name2 - new name of the user
 */

const renameuser = (member, name2) => {
    if(member.setNickname(name2)){
        return true;
    }else{
        return false;
    }
}

/**
 * @param {Object} message - Object which contains messages
 * @param {Number} amount - Number of message to be deleted
 */
const clearchat = async (message, amount) => {
    message.delete();
    let fetched = await message.channel.messages.fetch({limit: amount});
    await message.channel.bulkDelete(fetched);
}


client.once('ready', () =>{
    console.log(`Connected as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    const prefix = "!b";
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member.permissions.has("ADMINISTRATOR")){
        await message.reply("Your are not an administrator of this server");
    }
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if(cmd.length === 0)return;
    switch (cmd){
        case "ban":
            if(message.member.permissions.has('BAN_MEMBERS')){
                if(args[0] !== null && args[0] !== undefined){
                    let amount = Number(process.env.BAN_DAYS);
                    if(args[1] !== null && Number.isInteger(Number(args[1]))){
                        amount = Number(args[1]);
                    }
                    let member = message.mentions.members.first();
                    if(member === undefined){
                        await message.reply("Unknown user");
                    }
                    if(banuser(member, amount) === true){
                        await message.reply(":wave: " + member.displayName + " has been successfully banned :no_entry_sign:");
                    }else{
                        await message.reply("Issue please report to administrator");
                    }
                }else{
                    await message.reply("Missing username");
                }
            }else{
                await message.reply("You don't have the permission to do that");
            }
            break;
        case "kick":
            if(message.member.permissions.has('KICK_MEMBERS')){
                if(args[0] !== null && args[0] !== undefined){
                    let member = message.mentions.members.first();
                    if(member === undefined){
                        await message.reply("Unknown user");
                    }
                    if(kickuser(member) === true){
                        await message.reply(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
                    }else{
                        await message.reply("Issue please report to administrator");
                    }
                }else{
                    await message.reply("Missing username");
                }
            }else{
                await message.reply("You don't have the permission to do that");
            }
            break;
        case "rename":
            if(message.member.permissions.has('MANAGE_NICKNAMES')){
                if(args[0] !== null && args[0] !== undefined){
                    let member = message.mentions.members.first();
                    if(member === undefined){
                        await message.reply("Unknown user");
                    }
                    if(args[1] !== null && typeof args[1] == "string"){
                        if(renameuser(member,args[1]) === true){
                            await message.reply(":wave: " + member.displayName + " has been successfully renamed to : " + args[1] + " :white_check_mark: ");
                        }else{
                            await message.reply("Issue please report to administrator");
                        }
                    }else{
                        await message.reply("Please specify the new username");
                    }
                }else{
                    await message.reply("Missing username");
                }
            }else{
                await message.reply("You don't have the permission to do that");
            }
            break;
        case "clear":
            if(message.member.permissions.has('MANAGE_CHANNELS')){
                let amount = Number(process.env.CLEAR_AMOUNT);
                if(args[0] !== null && Number.isInteger(Number(args[0]))){
                    amount = Number(args[0]);
                }
                await clearchat(message,amount);
            }else{
                await message.reply("You don't have the permission to do that");
            }
            break;
        default:
            await message.reply("Unknown Command");
    }
});

client.login(process.env.TOKEN).then(r => {
    console.log("Logged successfully");
});
