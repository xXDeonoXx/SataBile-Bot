const maxQtd = 50;

module.exports.roll = function(args) {
    const qtd = args[0]; // Quantidade de dados
    const dice = args[1].slice(1); // Tipo de dado

    // Verificando que a quantidade de dados não exceda o máximo permitido
    if (qtd > maxQtd) {
        return 'Tá rolando dado demais, corno. Vai com calma.';
    }

    const results = new Array();

    for (let i = 0; i < qtd; i++) {
       results.push(Math.floor(Math.random() * dice + 1));
    }

    return results;
}