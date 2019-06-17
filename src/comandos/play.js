// Importando ytdl
const ytdl = require('ytdl-core');

// Criando queue
let queue = new Array();

var serverManager = new Array();

var server = {
	id: null,
	queue: new Array()
}



// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = false;

// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 1 };

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


//a função abaixo adiciona o id do servidor e o link a queue de um objeto server, que depois
//é adicionado a um array serverManager
updateServerManager = async(serverId, link) =>{
	//teste
	if(serverManager.find(x => x.id == serverId) != undefined){
		console.log("membro ja existe, adicionando musica...");		

		let index = null;
		serverManager.map((server, index) => {
			if (server.id === serverId) {
			  index = index;
		  }
		});

		console.log("index = " + index);
		serverManager[index].queue.push(link);

	}
	else{
		console.log("membro não existe, criando e adicionando musica...");
		let serverX = server;
		serverX.id = serverId;
		serverX.queue.push(link);
		serverManager.push(serverX);
		serverX = null;	

		let index = serverManager.findIndex(x => x.id === serverId);
		console.log(serverManager[index]);			
	}	
}