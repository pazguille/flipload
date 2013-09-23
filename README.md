# Flipload.js

Flipping HTML elements to show a loading indicator easily.

It's compatible with:
- Chrome
- Firefox
- Safari

## Installation

    $ component install pazguille/flipload

See: [https://github.com/component/component](https://github.com/component/component)

### Standalone
Also, you can use the standalone version:
```html
<script src="flipload.js"></script>
```

## How-to

First, you should add the CSS file to your markup:
```html
<link rel="stylesheet" href="flipload.css">
```

Then, you can start to use it and enjoy!
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
- `el`: A given `HTMLElement` to create an instance of `Flipload`.
- `options`: An optional Options `Object` to customize an instance.
    - `className`: Add a custom className to `reverse` element.
    - `line`: Rotate around `horizontal` or `vertical` line. By default is `vertical` line.
    - `theme`: Select what spinner theme you want to use: `light` or `dark`. By default is `dark`.
    - `text`: Adds some text to the `spinner`.

```js
var flipload = new Flipload(box, [options]);
```

### Flipload#load()
Flips and shows the `spinner`.

```js
flipload.load();
```

### Flipload#update()
Update size and positon values of the `reverse` element and `spinner`.

```js
flipload.update();
```

### Flipload#enable()
Enables an instance of `Flipload`.

```js
flipload.enable();
```

### Flipload#disable()
Disables an instance of `Flipload`.

```js
flipload.disable();
```

### Flipload#toggle()
Flips and shows or hides the `spinner` element.

```js
flipload.toggle();
```

### Flipload#done()
Flips and hides the `spinner`.

```js
flipload.done();
```

### Flipload#destroy()
Destroys an instance of `Flipload`.

```js
flipload.destroy();
```

## Contact
- Guillermo Paz (Frontend developer - JavaScript developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)


## License
Copyright (c) 2013 [@pazguille](http://twitter.com/pazguille) Licensed under the MIT license.