// Module dependencies.
var spin = require('spin'),
    win = window,
    doc = window.document,
    defaults = {
        'line': 'vertical',
        'theme': 'dark',
        'text': '',
        'className': ''
    };

function customizeOptions(options) {
    var prop;
    for (prop in defaults) {
        if (!options.hasOwnProperty(prop)) {
            options[prop] = defaults[prop];
        }
    }
    return options;
}

/**
 * Create a new instance of Flipload.
 * @constructor
 * @param {HTMLElement} el A given HTML element to create an instance of Flipload.
 * @param {Object} [options] Options to customize an instance.
 * @param {String} [options.className] Add a custom className to the reverse element to add custom CSS styles.
 * @param {String} [options.line] Rotate around horizontal or vertical line. By default is vertical line.
 * @param {String} [options.theme] Select what spinner theme you want to use: light or dark. By default is dark.
 * @param {String} [options.text] Add some text to the spinner.
 * @returns {flipload} Returns a new instance of Flipload.
 */
function Flipload(el, options) {

    if (el === undefined) {
        throw new Error('"Flipload(el, [options])": It must receive an element.');
    }

    this.initialize(el, options);

    return this;
}

/**
 * Initialize a new instance of Flipload.
 * @memberof! Flipload.prototype
 * @function
 * @param {HTMLElement} el A given HTML element to create an instance of Flipload.
 * @param {Object} [options] Options to customize an instance.
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.initialize = function (el, options) {

    this.el = el;

    // Customize options
    this.options = customizeOptions(options || {});

    this.loading = false;

    this._enabled = true;

    this.el.className += ' flipload-front flipload-front-' + this.options.line;

    // Create reverse element
    this._createReverse();

    // Create spinner
    this._createSpinner();

    // Store the flipload instance
    this.el.flipload = this;

    return this;
};

/**
 * Creates the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @private
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype._createReverse = function () {

    this.reverse = doc.createElement('div');

    this.reverse.style.position = win.getComputedStyle(this.el, "").getPropertyValue('position') === 'fixed' ? 'fixed' : 'absolute';;

    this.reverse.className = 'flipload-reverse flipload-reverse-' + this.options.line + ' ' + this.options.className;

    this._updateReverseSize();

    this._updateReverseOffset();

    this.el.parentNode.insertBefore(this.reverse, this.el);

    return this;
};

/**
 * Updates/refresh the size of the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @private
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype._updateReverseSize = function () {

    this.reverse.style.width = this.el.offsetWidth + 'px';
    this.reverse.style.height = this.el.offsetHeight + 'px';

    return this;
};

/**
 * Updates/refresh the offset of the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @private
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype._updateReverseOffset = function () {

    this.reverse.style.top = this.el.offsetTop + 'px';
    this.reverse.style.left = this.el.offsetLeft + 'px';

    return this;
};

/**
 * Creates spinner element.
 * @memberof! Flipload.prototype
 * @function
 * @private
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype._createSpinner = function () {

    this.spinner = spin(this.reverse);

    // Custom Options
    if (this.options.theme === 'light') {
        this.spinner.light();
    }

    this.spinner.text(this.options.text);

    return this;
};

/**
 * Update size and positon values of the reverse element and spinner.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.update = function () {

    if (!this._enabled) {
        return this;
    }

    // Update reverse
    this._updateReverseSize();
    this._updateReverseOffset();

    // Update spinner
    this.spinner.update();

    return this;
};

/**
 * Flips and shows the spinner.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.load = function () {

    if (this.loading || !this._enabled) {
        return this;
    }

    this.loading = true;

    this.el.className += ' flipload-loading';
    this.reverse.className += ' flipload-loading';

    return this;
};

/**
 * Flips and hides the spinner.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.done = function () {

    if (!this.loading || !this._enabled) {
        return this;
    }

    this.loading = false;

    this.el.className = this.el.className.replace(/flipload-loading/, '');
    this.reverse.className = this.reverse.className.replace(/flipload-loading/, '');

    return this;
};

/**
 * Toggle the spinner element.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.toggle = function () {

    if (this.loading) {
        return this.done();
    }

    this.load();

    return this;
};

/**
 * Enables an instance of Flipload.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.enable = function () {
    this._enabled = true;

    return this;
};

/**
 * Disables an instance of Flipload.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Returns the instance of Flipload.
 */
Flipload.prototype.disable = function () {
    this._enabled = false;

    return this;
};

/**
 * Destroys an instance of Flipload.
 * @memberof! Flipload.prototype
 * @function
 */
Flipload.prototype.destroy = function () {

    // Remove classNames
    this.el.className = this.el.className.replace(/flipload-front(-(vertical|horizontal))?/g, '');

    // Remove spinner
    this.spinner.remove();

    // Remove the reverse element
    this.el.parentNode.removeChild(this.reverse);

    // Remove the flipload instance
    this.el.flipload = undefined;
};

// Expose Flipload
exports = module.exports = Flipload;