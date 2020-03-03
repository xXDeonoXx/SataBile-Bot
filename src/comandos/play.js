/*
	Esse script é responsavel pela gerencia das musicas sendo tocadas EM TODOS SERVIDORES,
	serverManager possui todos os atributos usados pelos servidores no corpo de cada indice
	cada indice é criado usando o serverId de cada servidor
*/



// IMPORTANTE: existe um limite de quota diário com a qual a chave pode ser usada para fazer
// resquisições à api do youtube, cada search gasta 100 quota, e o total diario é de 10000
// por enquanto não descobri nenhum workaround para isso ou alguma alternativa, por enquanto
// permanecerá desse jeito.

// Key da api do youtube para usar com o youtube-api-v3
const $YOUTUBE_API_KEY = '';

// Importando o youtube api, usado para pesquisar por videos
const searchYoutube = require('youtube-api-v3-search');

//TODO preciso diminuir o uso de quota pegando apenas o titulo e o id do video, links para
//referencia: https://www.reddit.com/r/webdev/comments/aqou5b/youtube_api_v3_quota_issues/
//https://developers.google.com/youtube/v3/docs/videos/list?hl=pt-br

// Opções da busca
//referencia para opções de filtro https://developers.google.com/youtube/v3/docs/videos/list?hl=pt-br
const options = {
	q:'ASSUNTO A SE PESQUISAR',
	part:'snippet',
	maxResults: 1,
	order: 'relevance',
	safeSearch: 'none'
}

// Importando ytdl, usado para obter as streams de som do youtube
const ytdl = require('ytdl-core');

// Usado para guardar as "queues" de todos o servidores, cada um possui sua playlist individual
const serverManager = [];

let info = {
	queue: new Array(),
	inVoiceChannel: false,
	connection: null,
	title: ''
}

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 0.5 };


//Delay usado para await
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function(msg, link) {
	if(msg.member.voiceChannel == null){
		msg.reply("Tu tem que ta num canal de voz pra ouvir musica seu corno fodido");
		return;
	}
	let serverId = msg.member.guild.id;

	// Caso não existam informações para esse servidor, se cria um registro
	if(serverManager[serverId] === undefined){
		serverManager[serverId] = info;
	}

	if(ytdl.validateURL(link)){
		
		// O bloco abaixo pega as informações do video passado por link
		ytdl.getInfo(link, async function(err, info) {
			if (!serverManager[serverId].inVoiceChannel) {
				serverManager[serverId].inVoiceChannel = true;
				serverManager[serverId].connection = await msg.member.voiceChannel.join();	
				updateServerManager(serverId, link, info.title);
				this.playSong(serverId, msg);	
			} else {		
				updateServerManager(serverId, link, info.title);
			}
		});

	}else{
		console.log("A query é: " + msg.content.slice(6));
		searchVideoInfoAndPlay(msg, msg.content.slice(6), foundVideoInfo);
	}


};

playSong = (serverId, msg) => {
	// Criando stream
	const stream = ytdl(serverManager[serverId].queue[0], {
		filter: 'audioonly',
		// abaixo muda o cache para 10Mb, evita fim prematuro da musica
		highWaterMark: 1024 * 1024 * 1
	});

	const dispatcher = serverManager[serverId].connection.playStream(stream, streamOptions);
	dispatcher.on('end', () => {
		playNextSong(serverId, msg);
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
	serverManager[serverId].connection.disconnect();
	serverManager[serverId].inVoiceChannel = false;
	serverManager[serverId].serverManager = null;
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
function updateServerManager (serverId, link, title) {
	serverManager[serverId].queue.push(link);
	serverManager[serverId].title = title;
};





/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * altera a queue e toca a proxima musica da lista
 */
playNextSong = (serverId, msg) => {
		// a checagem abaixo ocorre pois connection[serverId] é setado
		// como null ao desconectar do canal de voz, isso causava uma excessção,
		// então agora ele só executa o bloco abaixo com connection sendo utilizado e existindo
		if(serverManager[serverId].connection != null){

			// Retirando musica da fila
			serverManager[serverId].queue.shift();
			
			// Verificando se temos mais musicas na fila
			if (serverManager[serverId].queue.length > 0) {
				msg.channel.send("Tocando: '" + serverManager[serverId].title + "' agora.");
				playSong(serverId, msg);
			} else {
				console.log('Não tem mais musica', serverManager[serverId].queue);
				exitVoiceChannel(serverId);
				msg.channel.send("Cabou as musicas filho da puta, posso mandar o zap agora ?");
			}
		}else{
			console.log("deu merda menó");
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
	serverManager[serverId].connection.dispatcher.end();
}




/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * pausa a musica tocando atualmente
 */
module.exports.pauseSong = function (serverId) {
	serverManager[serverId].connection.dispatcher.pause();
}




/**
 * @param {snowflake} serverId
 * @author Rômullo Cordeiro
 * @since 2019.06.20
 * @description
 * pausa a musica tocando atualmente
 */
module.exports.resumeSong = function (serverId) {
	serverManager[serverId].connection.dispatcher.resume();
}




/**
 * @author Rômullo Cordeiro
 * @since 2019.06.24
 * @description
 * pesquisa por um video e retorna as informações necessarias
 *
 * referencia de um JSON resultado de uma pesquisa:
 * https://developers.google.com/youtube/v3/docs/search/list?hl=pt-br - items (contem o resource)
 * https://developers.google.com/youtube/v3/docs/search?hl=pt-br#resource - Resource (id do video fica aqui dentro)
 */

async function searchVideoInfoAndPlay (msg, searchString, callback) {
	options.q = searchString;
	let result = await searchYoutube($YOUTUBE_API_KEY,options);
	
	callback(msg, result);
}


async function foundVideoInfo(msg, result) {
	let url = 'https://www.youtube.com/watch?v=' + result.items[0].id.videoId;
	let title = result.items[0].snippet.title;
	let serverId = msg.member.guild.id;
	updateServerManager(serverId, url, title);
	if(!serverManager[serverId].inVoiceChannel){
		serverManager[serverId].inVoiceChannel = true;
		serverManager[serverId].connection = await msg.member.voiceChannel.join();
		this.playSong(serverId, msg);
	}
	msg.reply(" '" + title + "' Adicionado a playlist");


}
