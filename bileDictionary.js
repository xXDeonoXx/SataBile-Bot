const frasesDoBile = [
    'Bota natiruts aí',
    'Vai tomar no cu',
    'Não sou suas puta',
    'O vizinho ta só a jbs'
];

module.exports.getFraseAleatoria = function() {
    return frasesDoBile[Math.floor(Math.random() * frasesDoBile.length)];
}