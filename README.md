# pasquale [![Build Status](https://travis-ci.org/cirocosta/pasquale.svg?branch=master)](https://travis-ci.org/cirocosta/pasquale)

> Checks for spelling errors in a given sentence (UNDER HEAVY DEV.)

```sh
$ npm install --save pasquale   # for your project
$ npm install -g pasquale-cli   # cli version
```

Check out the [cli version](github.com/cirocosta/pasquale-cli).

## Usage

`pasquale` is intended to be used as a module for checking spelling errors. You must, then, provide dicts for this.

For downloading them: `$ PASQUALE_PATH/bin/downloader [lang-alias]`.

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


#### LICENSE

**MIT LICENSE**
