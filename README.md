# SataBile-Bot

Esse bot do discord é feito por amigos.

## Como instalar o bot

  Apenas rode esse comando:

```node
npm install
```

  Após isso instale as dependencias necessárias, crie seu proprio auth.json e rode o bot.

# Comandos

### +roll

  Esse comando rola um dado
  Exemplo: `+roll 4d6`
  Exemplo de resultado: `@RôRo rolou: 3, 1, 1, 2, = 7`

### +bile

  Esse comando gera uma mensagem aleatoria
  Exemplo: `+bile`

  Exemplo de resultado: `Vai tomar no cu`

## +play

  Esse comando cria uma queue com links de youtube e faz com o que o bot se junte ao seu canal
de voz e toque musicas para você, o bot consegue guardar varios links em uma playlist:
  Ex: ```+play https://www.youtube.com/watch?v=dQw4w9WgXcQ```
 
### +pause

  Pausa a musica tocando.
  
### +resume
  
  Continua a musica que estava tocando.
  
### +skip

  Termina a musica atual e inicia a proxima.
  
### +stop

  Para completamente o player de musica e sai do canal.
  


## Metas

- [x] O Bot deverá ser capaz de falar coisas aleatórias (+bile)
- [x] O Bot deverá ser capaz de rolar dados (+roll)
- [ ] O Bot deverá ser capaz de retornar uma fala aleatória de um campeão (+zed, +thresh)
- [x] Devemos implementar a possibilidade de enfileirar musicas com o +play
- [ ] O Bot deve pesquisar e tocar um video apenas pelo nome
- [ ] O Bot devera ser capaz de enviar uma imagem de acordo com o assunto escolhido
