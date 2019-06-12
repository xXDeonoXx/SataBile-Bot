const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});




client.on('message', msg => {


  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
if(msg.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
if(msg.content.indexOf('+') !== 0) return;


  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
const args = msg.content.slice(1).trim().split(/ +/g);
const command = args.shift().toLowerCase();
console.log("args: " + args);
console.log("\ncommand: " + command);

    switch(command){
        case 'bile':
            msg.reply('vai tomar no cu');
        break

        case 'zap':
            msg.reply('Pera, to mandando um zap');
        break

        case 'roll':
            msg.reply('Vai jogar rpg no inferno, o bot ainda não ta pronto.');
        break

        case 'rombo':
            msg.reply('You have been blessed by the god Rombotron. May honey drip from your holy johnson, and may succubus be attracted to you.');
        break

        case 'minas':
            msg.reply('Gabirujo just rolled in his grave, anger is bringing him back from the dead.');
        break;
        
        case 'play':
            var voiceChannel = msg.member.voiceChannel;

            const ytdl = require('ytdl-core');
            const streamOptions = { seek: 0, volume: 1 };
            voiceChannel.join().then(connection =>{
                const stream = ytdl(args[0], { filter : 'audioonly' });                
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {voiceChannel.leave()});
            }).catch(err => console.log(err));
        break;
    }

});

client.login(auth.token);