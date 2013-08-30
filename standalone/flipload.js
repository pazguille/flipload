;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-css/index.js", function(exports, require, module){

/**
 * Properties to ignore appending "px".
 */

var ignore = {
  columnCount: true,
  fillOpacity: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true
};

/**
 * Set `el` css values.
 *
 * @param {Element} el
 * @param {Object} obj
 * @return {Element}
 * @api public
 */

module.exports = function(el, obj){
  for (var key in obj) {
    var val = obj[key];
    if ('number' == typeof val && !ignore[key]) val += 'px';
    el.style[key] = val;
  }
  return el;
};

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

});
require.register("component-autoscale-canvas/index.js", function(exports, require, module){

/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */

module.exports = function(canvas){
  var ctx = canvas.getContext('2d');
  var ratio = window.devicePixelRatio || 1;
  if (1 != ratio) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx.scale(ratio, ratio);
  }
  return canvas;
};
});
require.register("component-raf/index.js", function(exports, require, module){

/**
 * Expose `requestAnimationFrame()`.
 */

exports = module.exports = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || fallback;

/**
 * Fallback implementation.
 */

var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  setTimeout(fn, ms);
  prev = curr;
}

/**
 * Cancel.
 */

var cancel = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.oCancelAnimationFrame
  || window.msCancelAnimationFrame;

exports.cancel = function(id){
  cancel.call(window, id);
};

});
require.register("component-spinner/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var autoscale = require('autoscale-canvas');
var raf = require('raf');

/**
 * Expose `Spinner`.
 */

module.exports = Spinner;

/**
 * Initialize a new `Spinner`.
 */

function Spinner() {
  var self = this;
  this.percent = 0;
  this.el = document.createElement('canvas');
  this.ctx = this.el.getContext('2d');
  this.size(50);
  this.fontSize(11);
  this.speed(60);
  this.font('helvetica, arial, sans-serif');
  this.stopped = false;

  (function animate() {
    if (self.stopped) return;
    raf(animate);
    self.percent = (self.percent + self._speed / 36) % 100;
    self.draw(self.ctx);
  })();
}

/**
 * Stop the animation.
 *
 * @api public
 */

Spinner.prototype.stop = function(){
  this.stopped = true;
};

/**
 * Set spinner size to `n`.
 *
 * @param {Number} n
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.size = function(n){
  this.el.width = n;
  this.el.height = n;
  autoscale(this.el);
  return this;
};

/**
 * Set text to `str`.
 *
 * @param {String} str
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.text = function(str){
  this._text = str;
  return this;
};

/**
 * Set font size to `n`.
 *
 * @param {Number} n
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.fontSize = function(n){
  this._fontSize = n;
  return this;
};

/**
 * Set font `family`.
 *
 * @param {String} family
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.font = function(family){
  this._font = family;
  return this;
};

/**
 * Set speed to `n` rpm.
 *
 * @param {Number} n
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.speed = function(n) {
  this._speed = n;
  return this;
};

/**
 * Make the spinner light colored.
 *
 * @return {Spinner}
 * @api public
 */

Spinner.prototype.light = function(){
  this._light = true;
  return this;
};

/**
 * Draw on `ctx`.
 *
 * @param {CanvasRenderingContext2d} ctx
 * @return {Spinner}
 * @api private
 */

Spinner.prototype.draw = function(ctx){
  var percent = Math.min(this.percent, 100)
    , ratio = window.devicePixelRatio || 1
    , size = this.el.width / ratio
    , half = size / 2
    , x = half
    , y = half
    , rad = half - 1
    , fontSize = this._fontSize
    , light = this._light;

  ctx.font = fontSize + 'px ' + this._font;

  var angle = Math.PI * 2 * (percent / 100);
  ctx.clearRect(0, 0, size, size);

  // outer circle
  var grad = ctx.createLinearGradient(
    half + Math.sin(Math.PI * 1.5 - angle) * half,
    half + Math.cos(Math.PI * 1.5 - angle) * half,
    half + Math.sin(Math.PI * 0.5 - angle) * half,
    half + Math.cos(Math.PI * 0.5 - angle) * half
  );

  // color
  if (light) {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 1)');
  } else {
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 1)');
  }

  ctx.strokeStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, rad, angle - Math.PI, angle, false);
  ctx.stroke();

  // inner circle
  ctx.strokeStyle = light ? 'rgba(255, 255, 255, .4)' : '#eee';
  ctx.beginPath();
  ctx.arc(x, y, rad - 1, 0, Math.PI * 2, true);
  ctx.stroke();

  // text
  var text = this._text || ''
    , w = ctx.measureText(text).width;

  if (light) ctx.fillStyle = 'rgba(255, 255, 255, .9)';
  ctx.fillText(
      text
    , x - w / 2 + 1
    , y + fontSize / 2 - 1);

  return this;
};


});
require.register("component-spin/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var Spinner = require('spinner')
  , debug = require('debug')('spin')
  , css = require('css');

/**
 * Add a spinner to `el`,
 * and adjust size and position
 * based on `el`'s box.
 *
 * Options:
 *
 *    - `delay` milliseconds defaulting to 300
 *    - `size` size defaults to 1/5th the parent dimensions
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Spinner}
 * @api public
 */

module.exports = function(el, options){
  if (!el) throw new Error('element required');

  var appended = false;
  var spin = new Spinner(el);
  options = options || {};
  var ms = options.delay || 300;

  // update size and position
  spin.update = function(){
    debug('update');
    var w = el.offsetWidth;
    var h = el.offsetHeight;

    // size
    var s = options.size || w / 5;
    spin.size(s);
    debug('show %dpx (%dms)', s, ms);

    // position
    css(spin.el, {
      position: 'absolute',
      top: h / 2 - s / 2,
      left: w / 2 - s / 2
    });
  }

  spin.update();

  // remove
  spin.remove = function(){
    debug('remove');
    if (appended) el.removeChild(spin.el);
    spin.stop();
    clearTimeout(timer);
  };

  // append
  var timer = setTimeout(function(){
    debug('append');
    appended = true;
    el.appendChild(spin.el);
  }, ms);

  return spin;
};
});
require.register("flipload/index.js", function(exports, require, module){
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
});
require.alias("component-spin/index.js", "flipload/deps/spin/index.js");
require.alias("component-spin/index.js", "spin/index.js");
require.alias("component-css/index.js", "component-spin/deps/css/index.js");

require.alias("visionmedia-debug/index.js", "component-spin/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "component-spin/deps/debug/debug.js");

require.alias("component-spinner/index.js", "component-spin/deps/spinner/index.js");
require.alias("component-autoscale-canvas/index.js", "component-spinner/deps/autoscale-canvas/index.js");

require.alias("component-raf/index.js", "component-spinner/deps/raf/index.js");

require.alias("flipload/index.js", "flipload/index.js");

if (typeof exports == "object") {
  module.exports = require("flipload");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("flipload"); });
} else {
  this["Flipload"] = require("flipload");
}})();