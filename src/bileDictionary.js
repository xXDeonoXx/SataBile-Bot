const frasesDoBile = [
	'Bota natiruts aí',
	'Vai tomar no cu',
	'Não sou suas puta',
	'O vizinho ta só a jbs',
	'To mandando um Zap',
	'Deregue Johnson',
	'Cuidado com o colono',
	'Uma mulher sem pinto é um anjo sem asas',
	'Tem que falar agora ou posso pensar ?',
	'Porra cara, Aline Barros não',
	'Bora de crescente',
	'Um travesti sem asas é como um anjo sem pênis',
	'Aqui o bem não prevalece, sou blindado por Satan',
	'Farquad, Far Farquad, Far Farquad on a quad, Far quad Farquads on quad quads',
	'É hoje que eu esbagaço uma gorila',
	'Sou o rei da floresta'
];

module.exports.getFraseAleatoria = function() {
	return frasesDoBile[Math.floor(Math.random() * frasesDoBile.length)];
};
