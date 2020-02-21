require('dotenv').config();
require('@tensorflow/tfjs-node');
let toxicity = require('@tensorflow-models/toxicity');
let Discord = require('discord.js');
let client = new Discord.Client();

client.login(`${process.env.CONNECTION_TOKEN}`)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', async msg => {
    console.log(`${msg.author.username} said: ${msg.content}`)

    // Prevent the bot from responding to itself.
    if(msg.author.bot) return;

    const threshold = 0.9;
    toxicity.load(threshold).then(model => {
        model.classify(msg.content).then(predictions => {
          // Predictions[6] is the overall toxicity for the message.
          if (predictions[6].results[0].match) {
            console.log("This message is toxic.");
            
            // Play the toxic soundbyte.
            if(msg.member.voiceChannel)
            {
                msg.member.voiceChannel.join().then( connection => {
                    let dispatcher = connection.playFile("./toxic.mp3", {volume: 0.2});

                    // Dispatcher 'end' event is not firing. Temp workaround.
                    setTimeout(function(){
                        dispatcher.end();
                        msg.member.voiceChannel.leave();
                    }, 2000);
                });
            }

            msg
              .react("680243320852709473")
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
