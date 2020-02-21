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
    if(msg.author.bot) return;

    const threshold = 0.9;
    toxicity.load(threshold).then(model => {
        model.classify(msg.content).then(predictions => {
          // Get the overall toxicity result from this prediction.
          console.log(predictions[6].results[0].match);

          if (predictions[6].results[0].match) {
            console.log("This message is toxic.");
            
            // Play the toxic soundbyte.
            if(msg.member.voiceChannel)
            {
                msg.member.voiceChannel.join().then( connection => {
                    let dispatcher = connection.playFile("./toxic.mp3", {volume: 0.2});

                    setTimeout(function(){
                        dispatcher.end();
                        msg.member.voiceChannel.leave();
                    }, 2000);
                });
            }

            // React with toxic.
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
