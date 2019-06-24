/*
	Esse script é responsavel pela gerencia das musicas sendo tocadas EM TODOS SERVIDORES,
	todos os objetos que são array são usados para gerir isso, os indices são gerados
	com o id do server e cada indice possui os atributos de seus respectivos servidores

	ex: serverManager[123123] contem a queue de musicas do servidor 123123
		inVoiceChannel[123123] é a flag para saber se o bot está em algum canal no server 123123
		connection[123123] é usado para tocar a musica no canal 123123
*/

// Key da api do youtube para usar com o youtube-api-v3
const $YOUTUBE_API_KEY = 'AIzaSyAIQNaWE2afFRiFBQTPBOLFmnRUZUyK_Pg';

// Importando o youtube api, usado para pesquisar por videos
const searchYoutube = require('youtube-api-v3-search');

// Opções da busca
const options = {
	q:'ASSUNTO A SE PESQUISAR',
	part:'snippet', // array com title, description, thumbnails, channel title e etc
	type:'video' // tipo de conteudo a ser buscado
  }



// Importando ytdl, usado para obter as streams de som do youtube
const ytdl = require('ytdl-core');

// Usado para guardar as "queues" de todos o servidores, cada um possui sua playlist individual
const serverQueueManager = [];

// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = [];

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 0.5 };

//Connection é a conexão do bot no canal de voz, é usado para tocar stream de musicas ou para-las
let connection = [];

//Delay usado para await
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function(msg, link) {
	if(msg.member.voiceChannel == null){
		msg.reply("Tu tem que ta num canal de voz pra ouvir musica seu corno fodido");
		return;
	}
	let serverId = msg.member.guild.id;

	if (inVoiceChannel[serverId] === null) {
		inVoiceChannel[serverId] = false;
	}

	if (!inVoiceChannel[serverId]) {
		inVoiceChannel[serverId] = true;
		connection[serverId] = await msg.member.voiceChannel.join();
		if(ytdl.validateURL(link)){
			updateServerManager(serverId, link);
			this.playSong(serverId);
		}else{
			//searchVideoAndPlay(serverId, link);
		}
	} else {
		updateServerManager(serverId, link);
	}

};

playSong = (serverId) => {
	// Criando stream
	const stream = ytdl(serverQueueManager[serverId].queue[0], {
		filter: 'audioonly',
		// abaixo muda o cache para 10Mb, evita fim prematuro da musica
		highWaterMark: 1024 * 1024 * 1
	});
	
	const dispatcher = connection[serverId].playStream(stream, streamOptions);

	dispatcher.on('end', () => {
		playNextSong(serverId);
	});
};




/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.17
 * @description
 * função para sair do canal de voz com um pequeno delay
 */
exitVoiceChannel = async serverId => {
	await delay(1000);
	connection[serverId].disconnect();
	inVoiceChannel[serverId] = false;
	serverQueueManager[serverId] = null;
};




/**
 * @param {snowflake} serverId
 * @param {string} link
 * @author Lucas Sousa, Rômullo Cordeiro
 * @since 2019.06.17
 * @description
 * Método para manter um objeto que será utilizado para
 * gerenciar diferentes filas em diferentes servidores.
 */
updateServerManager = async (serverId, link) => {
	// Verificando se já temos uma fila neste server
	if (serverQueueManager[serverId]) {
		console.log('Já temos uma fila aqui');
	} else {
		console.log('Não temos uma fila');
		// Não temos uma fila, devemos cria-la
		serverQueueManager[serverId] = {
			queue: new Array()
		};
	}

	// Adicionando musica na queue.
	serverQueueManager[serverId].queue.push(link);
};





/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * altera a queue e toca a proxima musica da lista
 */
playNextSong = (serverId) => {
		// a checagem abaixo ocorre pois connection[serverId] é setado
		// como null ao desconectar do canal de voz, isso causava uma excessção,
		// então agora ele só executa o bloco abaixo com connection sendo utilizado e existindo
		if(connection[serverId] != null){

			// Retirando musica da fila
			serverQueueManager[serverId].queue.shift();
			
			// Verificando se temos mais musicas na fila
			if (serverQueueManager[serverId].queue.length > 0) {
				playSong(serverId);
			} else {
				console.log('Não tem mais musica', serverQueueManager[serverId].queue);
				exitVoiceChannel(serverId);
			}
		}
}


//funções abaixas são as chamadas foras desse script

/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.17
 * @description
 * usada para chamar do index caso queira parar o player
 */
module.exports.stopSong = function(serverId) {
	exitVoiceChannel(serverId);		
};





/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * termina a musica tocando atualmente fazendo com que a proxima seja tocada
 */
module.exports.skipSong = function (serverId) {
	connection[serverId].dispatcher.end();
}




/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * pausa a musica tocando atualmente
 */
module.exports.pauseSong = function (serverId) {
	connection[serverId].dispatcher.pause();
}




/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * pausa a musica tocando atualmente
 */
module.exports.resumeSong = function (serverId) {
	connection[serverId].dispatcher.resume();
}




/**
 * @author Rômullo Cordeiro
 * @since 2019.06.24
 * @description
 * pesquisa por um video e retorna as informações necessarias
 *
 * referencia de um JSON resultado de uma pesquisa:
 * https://developers.google.com/youtube/v3/docs/search?hl=pt-br#resource
 */

searchVideoAndPlay = async (serverId, searchString) => {
	options.q = searchString;
	let result = await searchYoutube($YOUTUBE_API_KEY,options);
	let url = 'https://www.youtube.com/watch?v=' + result.items[0].id;
	let title = result.items[0].title;
}
