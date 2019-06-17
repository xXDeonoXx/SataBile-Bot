// Importando ytdl
const ytdl = require('ytdl-core');

// Criando queue
let queue = new Array();

// Criando o server manager
const serverManager = [];



// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = false;

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 0 };

//Connection precisa ja existir pois sera usada em outras funções de play
let connection = null;

//Delay usado para await
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function (msg, link) {
	if (!inVoiceChannel) {
		connection = await msg.member.voiceChannel.join();
		inVoiceChannel = true;
		queue.push(link);
		updateServerManager(msg.member.guild.id, link);

		this.playSong(connection);
	} else {
		queue.push(link);
		updateServerManager(msg.member.guild.id, link);
	}
};

playSong = (connection) => {
	// Criando stream
	const stream = ytdl(queue[0], {
		 filter: 'audioonly', 
		 // abaixo muda o cache para 10Mb, evita fim prematuro da musica
		 highWaterMark: 1024 * 1024 * 10 
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


/**
 * @param {string} serverId
 * @param {string} link
 * @author Lucas Sousa, Rômullo Cordeiro
 * @since 2019.06.17
 * @description
 * Método para manter um objeto que será utilizado para
 * gerenciar diferentes filas em diferentes servidores.
 */
updateServerManager = async (serverId, link) => {
	// Verificando se já temos uma fila neste server
	if (serverManager[serverId]) {
		console.log('Já temos uma fila aqui');
	} else {
		console.log('Não temos uma fila');
		// Não temos uma fila, devemos cria-la
		serverManager[serverId] = {
			queue: new Array()
		}
	}

	// Adicionando musica na queue.
	serverManager[serverId].queue.push(link);
}