// Importando ytdl
const ytdl = require('ytdl-core');

// Criando queue
let queue = new Array();
// Flag para sabermos se já estamos no voice channel
let inVoiceChannel = false;
// Opcoes de reproducao
const streamOptions = { seek: 0, volume: 1 };

module.exports = async function (voiceChannel, link) {
    if (!inVoiceChannel) {
        const connection = await voiceChannel.join();
        inVoiceChannel = true;
        queue.push(link);
        this.playSong(connection);
    } else {
        queue.push(link);
    }
}

playSong = (connection) => {
    // Criando stream
    const stream = ytdl(queue[0], { filter: 'audioonly' });
    const dispatcher = connection.playStream(stream, streamOptions);

    dispatcher.on('end', () => {
        // Removendo musica da fila
        queue.shift();
        // Verificando se temos mais musicas na fila
        if (queue.length > 0) {
            playSong(connection, queue[0]);
        } else {
            console.log('Não tem mais musica', queue);
        }
    });
}