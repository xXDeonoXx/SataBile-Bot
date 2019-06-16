// Importando ytdl
const ytdl = require('ytdl-core');

const commandPlay = async (connection, voiceChannel, link, msg, queue) => {
	connection = await connect();

	if (queue > 0) {
		queue.push(link);
	} else {
		queue.push(link);
		await play();
	}

	// conecta no canal de voz do usuário
	async function connect() {
		if (voiceChannel === undefined) {
			msg.reply(
				'Ae mano na moralzinha, entra num canal de voz ai fazeno o favo.'
			);
		}

		return connection ? connection : await voiceChannel.join();
	}

	async function play() {
		const stream = ytdl(queue[0], { filter: 'audioonly' });
		const streamOptions = { seek: 0, volume: 1 };
		const dispatcher = connection.playStream(stream, streamOptions);
		msg.reply('music queue: ', queue);
		dispatcher.on('end', () => {
			queue.shift();
			if (queue.length > 0) {
				play();
			} else {
				msg.reply(
					'Ae menó, acabo o som aqui, vou la na casa da sua mãe pegar o resto'
				);
				if(voiceChannel){
					voiceChannel.leave();
				}
			}
		});
	}
};

module.exports = commandPlay;
