# pasquale [![Build Status](https://travis-ci.org/cirocosta/pasquale.svg?branch=master)](https://travis-ci.org/cirocosta/pasquale)

> Checks for spelling errors in a given sentence (UNDER HEAVY DEV.)

```sh
$ npm install -g pasquale       # global (CLI rocks)
$ npm install --save pasquale   # for your project
```

## Usage

**pasquale** is intended to be used within a shell or directly in code.

### Shell

```
Usage: $ pasquale --lang=[lang] [text]

Examples:
  $ pasquale --lang=pt-br istu é um testo errado    undefined


Options:
  -l, --lang  The language to check spelling against     [default: "pt-br"]
  -t, --text  The text to have spelling checked against
```

### Code

```javascript
pasquale = new Pasquale();
pasquale.setLanguage('en-ca');
pasquale.checkTextSpell('this is greatt').then(function (results) {
		console.log(results);
}, function (err) {
		console.error(err);
});

// [ { word: 'this', correct: true },
//   { word: 'is', correct: true },
//   { word: 'greatt',
//     correct: false,
//     suggestions: [ 'great', 'greats', 'great t', 'Gretta' ] } ]
```

## Languages

Using the default (`bower_components/Dictionaries`), the supported languages are:

|          name         |  key  |
|-----------------------|-------|
| Català                |       |
| Croatian              |       |
| Dansk                 |       |
| Deutsch               | de    |
| Deutsch (AT)          | de-at |
| Deutsch (CH)          | de-ch |
| Deutsch (DE)          | de-de |
| Czech                 | cs    |
| Ελληνικά              |       |
| English (Canadian)    | en-ca |
| English (British)     | en-gb |
| Español               | es    |
| Français              | fr    |
| Galego                |       |
| Italiano              |       |
| Lietuvių              |       |
| Magyar                |       |
| Nederlands            |       |
| Norwegian (Bokmål)    |       |
| Norwegian (Nynorsk)   |       |
| Română                |       |
| Polski                |       |
| Português (do Brasil) | pt-br |
| Português (Europeu)   | pt    |
| Русский               |       |
| Slovenian             |       |
| Slovensky             |       |
| Svenska               |       |
| Tiếng Việt            |       |
| Українська            |       |


## TODO

-	[ ] deixar o usuário especificar o diretório com os dicionários dele
-	[x] verificar problemas com utf8 *(parece ter sido solucionado com o unicode_hack)*
-	[ ] expor no `--help` o mapeamento de lingua/lang-code
-	[ ] definir um bom formato de saída para os resultados (p/ linha e p/ multilinhas - texto)
-	[ ] paralelizar a operação de checagem


#### LICENSE

**MIT LICENSE**
