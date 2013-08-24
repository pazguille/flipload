// Module dependencies.
var spin = require('spin'),
    win = window,
    doc = window.document;

/**
 * Create a new instance of Flipload.
 * @constructor
 * @property {HTMLElement} el  A given HTML element to create an instance of Flipload.
 * @property {Object} [options] Options to customize an instance.
 * @returns {flipload} Am instance of Flipload.
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
 * @property {HTMLElement} el  A given HTML element to create an instance of Flipload.
 * @property {Object} [options] Options to customize an instance.
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.initialize = function (el, options) {

    this.el = el;
    this.loading = false;
    this.el.className += ' flipload-front';

    // Create reverse element
    this.createReverse();

    // Create spinner
    this.createSpinner();

    return this;
};

/**
 * Creates the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.createReverse = function () {
    var parent = this.el.parentNode,
        position = win.getComputedStyle(this.el, "").getPropertyValue('position') === 'fixed' ? 'fixed' : 'absolute';

    this.reverse = doc.createElement('div');

    this.reverse.style.position = position;
    this.reverse.className += ' flipload-reverse';

    this.updateReverseSize();

    this.updateReverseOffset();

    parent.insertBefore(this.reverse, this.el);

    return this;
};

/**
 * Updates/refresh the size of the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.updateReverseSize = function () {

    this.reverse.style.width = this.el.offsetWidth + 'px';
    this.reverse.style.height = this.el.offsetHeight + 'px';

    return this;
};

/**
 * Updates/refresh the offset of the reverse element.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.updateReverseOffset = function () {

    this.reverse.style.top = this.el.offsetTop + 'px';
    this.reverse.style.left = this.el.offsetLeft + 'px';

    return this;
};

/**
 * Creates spinner element.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.createSpinner = function () {
    this.spinner = spin(this.reverse);

    return this;
};

/**
 * Flips and shows the spinner.
 * @memberof! Flipload.prototype
 * @function
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.load = function () {

    if (this.loading) {
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
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.done = function () {

    if (!this.loading) {
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
 * @returns {flipload} Am instance of Flipload.
 */
Flipload.prototype.toggle = function () {

    if (this.loading) {
        return this.done();
    }

    this.load();

    return this;
};

/**
 * Destroys an instance of Flipload.
 * @memberof! Flipload.prototype
 * @function
 */
Flipload.prototype.destroy = function () {
    var parent = this.el.parentNode;

    this.el.className = this.el.className.replace(/flipload-front/, '');

    this.spinner.remove();

    parent.removeChild(this.reverse);
};

// Expose Flipload
exports = module.exports = Flipload;