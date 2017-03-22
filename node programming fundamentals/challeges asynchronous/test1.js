function asyncFunction(callback) {
    setTimeout(callback, 200);
}

var color = 'blue';

asyncFunction(function () {
    console.log('1. The color is ' + color);       // this is executed last 200ms later
})

/**
 * using anonymous function
 * to preserve a global variable value
 * the following code will execute blue as color
 * ==============================================
 * (function(color) {
     asyncFunction(function () {
         console.log('2. The color is ' + color);       // blue color will executek, because color becomes local to the scope
     })
 })(color)
 */

color = 'green';
