var Flipload = require('flipload'),
    img = document.getElementById('img'),
    iframe = document.getElementById('video'),
    flip1 = new Flipload(document.getElementById('example1')),
    flip2 = new Flipload(document.getElementById('example2')),
    flip3 = new Flipload(document.getElementById('example3')),
    flip4 = new Flipload(document.getElementById('example4')),
    flip5 = new Flipload(document.getElementById('example5'));
    flip6 = new Flipload(document.getElementById('example6'), {
        'className': 'custom-reverse',
        'theme': 'light',
        'text': 'Loading...'
    }),
    flip7 = new Flipload(document.getElementById('example7'), {
        'line': 'horizontal',
    });

document.getElementById('example1').onclick = function () {
    flip1.load();
    window.setTimeout(function () {
        flip1.done();
    }, 2000);
};

document.getElementById('example2').onsubmit = function () {
    flip2.load();

    window.setTimeout(function () {
        flip2.done();
    }, 2000);

    return false;
};

document.getElementById('example3').onclick = function () {
    flip3.load();
    window.setTimeout(function () {
        flip3.done();
    }, 2000);
};

document.getElementById('example4').onclick = function () {
    flip4.load();
    window.setTimeout(function () {
        flip4.done();
    }, 2000);
};

document.getElementById('example5').onclick = function () {
    flip5.load();

    iframe.onload = function () {
        flip5.reverse.style.zIndex = '10';
        flip5.done();
        img.parentNode.removeChild(img);
        this.style.display = 'block';
    };

    window.setTimeout(function () {
        iframe.src = 'http://www.youtube.com/embed/xEhaVhta7sI?html5=1&autoplay=1';
    }, 2000);

};

document.getElementById('example6').onclick = function () {
    flip6.load();
    window.setTimeout(function () {
        flip6.done();
    }, 2000);
};

document.getElementById('example7').onclick = function () {
    flip7.load();
    window.setTimeout(function () {
        flip7.done();
    }, 2000);
};