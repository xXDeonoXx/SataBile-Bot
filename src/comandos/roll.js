//quantidade maxima de dados
const maxQtd = 50;

module.exports.roll = function(args) {
	const qtd = args[0].slice(0,1); // Quantidade de dados
	const dice = args[0].slice(args[0].indexOf('d')+1); // Tipo de dado

	try {
		// Verificando que a quantidade de dados não exceda o máximo permitido
		if (qtd > maxQtd) {
			return 'Tá rolando dado demais, corno. Vai com calma.';
		}

		const results = new Array();

		//gera os valores
		for (let i = 0; i < qtd; i++) {
			results.push(Math.floor(Math.random() * dice + 1));
		}

		//soma total das rolagens
		var sum = 0;
		for(var i = 0; i < results.length; i++){
			sum += results[i];
		}
        
		//montando String para mensagem com as rolagens
		var s = '';
		for(var i = 0; i < results.length; i++){
			s += results[i] + ', ';
		}
		s += '= ' + sum;

		if(isNaN(qtd) || isNaN(sum)){
			return 'Rolagem de dados incorreta';
		}

		return s;        
	} catch (error) {        
		console.log('Erro:  ' + error);
	}

};