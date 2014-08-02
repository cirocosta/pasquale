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

### Example

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

### Reference

#### Pasquale (options)
```
/**
 * Constructor for Pasquale.
 * @param {object} options object containing
 * some options to be used: ignored -> words to
 * be ignored
 */
```
#### .setLanguage (lang, dir)
```
/**
 * Sets the language to check the texts against
 * @param {string} lang The language as
 *                      described in lang-mapping
 * @param {string} dir the abs path to the dicts
 *                     dir
 */
```
#### .checkTextSpell (text)
```
/**
 * Checks the spelling of a given text (multi or
 * single line)
 * @param  {string} text The text to check
 * @return {Promise}      a promise containing
 * the results (array of arrays)
 */
```
#### .checkLineSpell (text, lineCount)
```
/**
 * Checks the spelling for a given line.
 * @param  {string} text      A line of text
 * @param  {string|number} lineCount the number
 * of the line
 * @return {Promise}   A promisse with the
 * results (array)
 */
```
#### .checkWordSpell (word, opts)
```
/**
 * Checks the spelling for a given word
 * @param  {string} word the word to check
 * @param  {obj} opts some more info about where
 * the word was found
 * @return {promise}      A promise containing
 * the results for the word
 */
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
