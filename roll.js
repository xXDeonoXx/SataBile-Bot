const maxQtd = 50;

module.exports.roll = function(args) {
    const qtd = args[0].slice(0,1); // Quantidade de dados
    const dice = args[0].slice(args[0].indexOf("d")+1); // Tipo de dado
    

    console.log("qnt: " + qtd);
    console.log("dice: " + dice);

    try {
        // Verificando que a quantidade de dados não exceda o máximo permitido
        if (qtd > maxQtd) {
            return 'Tá rolando dado demais, corno. Vai com calma.';
        }

        const results = new Array();

        for (let i = 0; i < qtd; i++) {
            results.push(Math.floor(Math.random() * dice + 1));
        }

        return results;        
    } catch (error) {
        console.log("formato de roll incorreto: " + error);
    }

}