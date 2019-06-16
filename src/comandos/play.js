// Importando ytdl
const ytdl = require('ytdl-core');

// Criando queue
let queue = new Array();

// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = false;

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 1 };

//Connection precisa ja existir pois sera usada em outras funções de play
let connection = null;

//Delay usado para await
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function (voiceChannel, link) {
	if (!inVoiceChannel) {
		connection = await voiceChannel.join();
		inVoiceChannel = true;
		queue.push(link);
		this.playSong(connection);
	} else {
		queue.push(link);
	}
	return null;
};

playSong = (connection) => {
	// Criando stream
	const stream = ytdl(queue[0], {
		 filter: 'audioonly', 
		 highWaterMark: 1024 * 1024 * 10 // 10 megabytes
		});
	const dispatcher = connection.playStream(stream, streamOptions);

	dispatcher.on('end', () => {
		// Removendo musica da fila
		queue.shift();
		// Verificando se temos mais musicas na fila
		if (queue.length > 0) {
			playSong(connection, queue[0]);
		} else {
			console.log('Não tem mais musica', queue);
			exitVoiceChannel();
		}
	});
};

module.exports.stopSong = function(){
	ytdl.stopSong;
	stream = null;
	dispatcher = null;
	exitVoiceChannel();
}

exitVoiceChannel = async () => {
	await delay(1000);
	connection.disconnect();
	inVoiceChannel = false;
}