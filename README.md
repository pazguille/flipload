# Flipload.js

Flipping elements and show a loading indicator easily.

It's compatible with:
- Chrome
- Firefox
- Safari

## Installation

    $ component install pazguille/is-near

See: [https://github.com/component/component](https://github.com/component/component)

### Standalone
Also, you can use the standalone version:
```html
<script src="flipload.js"></script>
```

## How-to

```js
var Flipload = require('flipload');
    box = document.getElementById('box'),
    flip = new Flipload(box);

// Start to load
flip.load();

// Loaded
window.setTimeout(function () {
    flip.done();
}, 5000);
```
[View demo page](http://pazguille.github.io/flipload/)

## API

### Flipload(el, options)
Create a new instance of `Flipload`.
- `el` {HTMLElement} - A given HTML element to create an instance of `Flipload`.
- `options` {Object} [optional] - Options to customize an instance. (Coming soon)

```js
var flipload = new Flipload(box, [options]);
```

### Flipload#load()
Flips and shows the `spinner`.

```js
flipload.load();
```

### Flipload#done()
Flips and hides the spinner.

```js
flipload.done();
```

## Contact
- Guillermo Paz (Frontend developer - JavaScript developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)


## License
Copyright (c) 2013 [@pazguille](http://twitter.com/pazguille) Licensed under the MIT license.