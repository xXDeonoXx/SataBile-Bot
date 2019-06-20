// aqui é o início do programa
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


const bileDictionary = require('./bileDictionary');
// Importando roll
const roll = require('./comandos/roll');
// Importando play
const play = require('./comandos/play');


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
	console.log('args: ' + args);
	console.log('\ncommand: ' + command);


	//try catch para evitar que o bot crashe
	try {
		switch(command){
        
			//retorna uma citação maravilhosa de nosso deus bile aleatóriamente
			case 'bile':
				msg.reply(bileDictionary.getFraseAleatoria());
				break;
	
				//rola dados
			case 'roll':            
				msg.channel.send(msg.author + ' rolou: ' + roll.roll(args));
				break;
	
			case 'zap':
				msg.reply('Pera, to mandando um zap');
				break;
	
			case 'rombo':
				msg.reply('You have been blessed by the god Rombotron. May honey drip from your holy johnson, and may succubus be attracted to you.');
				break;
	
			case 'minas':
				msg.reply('Gabirujo just rolled in his grave, anger is bringing him back from the dead.');
				break;
	
			case 'golira':
				msg.reply('Bile is being summoned.');
				break;
				
			//comandos do player de musica abaixo
			case 'play':
					play(msg, args[0]);					
				break;
			
			case 'stop':
				play.stopSong(msg.member.guild.id);
				msg.reply("Vai tomar no cu também, não toco mais nada pra tu.");
				break;
	
			case 'skip':
				play.skipSong(msg.member.guild.id);
			break;

			case 'pause':
				play.pauseSong(msg.member.guild.id);
				msg.reply("Tá cara, eu pauso essa porra");
			break;
			
			case 'resume':
				play.resumeSong(msg.member.guild.id);
				msg.reply("Agora quer ouvir ? parece couro de pica porra");
			break;			
		}		
	} catch (error) {
		
	}

});

client.login(auth.token);