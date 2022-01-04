const {Client, Intents} = require('discord.js');
require('dotenv').config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

client.once('ready', () =>{
    console.log(`Connected as ${client.user.tag}`);
});

client.login(process.env.TOKEN).then(r => {
    console.log("Logged successfully");
});
