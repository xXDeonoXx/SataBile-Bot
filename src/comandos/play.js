/*
	Esse script é responsavel pela gerencia das musicas sendo tocadas EM TODOS SERVIDORES,
	todos os objetos que são array são usados para gerir isso, os indices são gerados
	com o id do server e cada indice possui os atributos de seus respectivos servidores

	ex: serverManager[123123] contem a queue de musicas do servidor 123123
		inVoiceChannel[123123] é a flag para saber se o bot está em algum canal no server 123123
		connection[123123] é usado para tocar a musica no canal 123123

		TODO: resta fazer o stop song
*/

// Importando ytdl
const ytdl = require('ytdl-core');

// Criando o server manager
const serverManager = [];

// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = [];

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 0.5 };

//Connection precisa ja existir pois sera usada em outras funções de play
let connection = [];

//Delay usado para await
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function(msg, link) {
	let serverId = msg.member.guild.id;

	if (inVoiceChannel[serverId] === null) {
		inVoiceChannel[serverId] = false;
	}

	if (!inVoiceChannel[serverId]) {
		inVoiceChannel[serverId] = true;
		connection[serverId] = await msg.member.voiceChannel.join();
		updateServerManager(serverId, link);
		this.playSong(connection[serverId], serverId);
	} else {
		updateServerManager(serverId, link);
	}
};

playSong = (connection, serverId) => {
	// Criando stream
	const stream = ytdl(serverManager[serverId].queue[0], {
		filter: 'audioonly',
		// abaixo muda o cache para 10Mb, evita fim prematuro da musica
		highWaterMark: 1024 * 1024 * 1
	});
	const dispatcher = connection.playStream(stream, streamOptions);

	dispatcher.on('end', () => {
		// Removendo musica da fila
		serverManager[serverId].queue.shift();
		// Verificando se temos mais musicas na fila
		if (serverManager[serverId].queue.length > 0) {
			playSong(connection, serverId);
		} else {
			console.log('Não tem mais musica', serverManager[serverId].queue);
			exitVoiceChannel(serverId);
		}
	});
};

module.exports.stopSong = function(msg) {
	ytdl.stopSong;
	stream = null;
	dispatcher = null;
	exitVoiceChannel();
};

//função para sair do canal de voz com um pequeno delay
exitVoiceChannel = async serverId => {
	await delay(1000);
	connection[serverId].disconnect();
	inVoiceChannel = false;
};

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
		};
	}

	// Adicionando musica na queue.
	serverManager[serverId].queue.push(link);
};
