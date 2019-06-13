const frasesDoBile = [
    'Bota natiruts aí',
    'Vai tomar no cu',
    'Não sou suas puta',
    'O vizinho ta só a jbs',
    'To mandando um Zap',
    'Deregue Johnson',
    'Cuidado com o colono',
    'Uma mulher sem pinto é um anjo sem asas',
    'Tem que falar agora ou posso pensar ?'
];

module.exports.getFraseAleatoria = function() {
    return frasesDoBile[Math.floor(Math.random() * frasesDoBile.length)];
}