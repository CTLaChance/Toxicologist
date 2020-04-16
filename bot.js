require('dotenv').config();
let toxicity = require('@tensorflow-models/toxicity');
let Discord = require('discord.js');
let client = new Discord.Client();

const whitelist = ["dumb", "stupid"];

client.login(`${process.env.CONNECTION_TOKEN}`)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    console.log(`${msg.author.username} said: ${msg.content}`)

    // Prevent the bot from responding to itself.
    if(msg.author.bot) return;

    // Checks the string for a whitelisted word.
    if(whitelist.some(substring => msg.content.toLowerCase().includes(substring))) {
        console.log("This message contains a whitelisted word.");
        return;
    }

    toxicity.load(0.95).then(model => {
        model.classify(msg.content).then(predictions => {
            // Predictions[6] is the overall toxicity for the message.
            if (predictions[6].results[0].match) {
                console.log("This message is toxic.");
                
                msg.react("680243320852709473")
                    .then(() => msg.react("🇹"))
                    .then(() => msg.react("🇴"))
                    .then(() => msg.react("🇽"))
                    .then(() => msg.react("🇮"))
                    .then(() => msg.react("🇨"))
                    .then(() => msg.react("☣️"));
            }
        });
    });
});
