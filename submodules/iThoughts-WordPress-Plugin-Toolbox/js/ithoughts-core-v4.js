/**
 * @file Minify compliant generic shorthands
 *
 * @author Alexandre Germain
 * @copyright 2016 iThoughts informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package iThoughts-toolbox
 *
 */

/**
 * @namespace iThoughts
 * @description iThoughts Helpers versions
 */
/**
 * @namespace Ithoughts.v4
 * @@memberof iThoughts
 * @description iThoughts v4 Helpers
 */

if(typeof Ithoughts == "undefined")
    var Ithoughts = {};

(function(s){
    'use strict';

    /**
     * @function isNA
     * @description Tests if the value is null or undefined
     * @author Gerkin
     * @param value The value to test
     * @returns {Boolean} Returns true if `value` is null or undefined
     */
    function isNA(value) {return value === null || typeof value === "undefined";}

    if(isNA(s.v4))
        s.v4 = {};
    else
        return;

    var v4 = s.v4,
        d = document,
        w = window,
        el = Element,
        et = typeof EventTarget != "undefined" && !isNA(EventTarget) ? EventTarget : document.createDocumentFragment().constructor,
        dc = v4.deepClone = function(obj){
            var newT,
                i;
            if(!isNA(obj)){
                switch(obj.constructor){
                    case Object:{
                        newT = {};
                        for(var i in obj){
                            if(hop(obj, i)){
                                newT[i] = dc(obj[i]);
                            }
                        }
                        return newT;
                    } break;

                    case Array:{
                        newT = [];
                        for(var i in obj){
                            if(hop(obj, i)){
                                newT[i] = dc(obj[i]);
                            }
                        }
                        return newT;
                    } break;

                    default:{
                        return obj;
                    }
                }
            } else {
                return obj;
            }
        }
    /**
     * @function isNA
     * @description Check if value is null or undefined
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {*} value The value tu check
     * @returns {boolean} True if null or undefined, false otherwise
     */
    v4.isNA = isNA;



    /**
     * @function waitFor
     * @description Look into `scope` for property `prop` every `every`ms, then execute `callback` when the property exists
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {*} scope The parent scope to check for property in
     * @param {string} prop Name of the property to wait for
     * @param {integer} [every] Time in ms between each checks
     * @param {function} callback Function to execute once property exists
     * @returns {undefined} Async
     */
    v4.waitFor = function(scope, prop, every, callback){
        if(typeof every == "function"){
            callback = every;
            every = undefined;
        }
        if(typeof scope != "object" || typeof prop != "string" || (typeof every == "number" && typeof callback != "function") || typeof callback != "function"){
            throw TypeError("\"waitFor\" expects following types combinations:\n" +
                            "\t{Object} scope\, {String} prop, {Number} every, {Function} callback\n" +
                            "\t{Object} scope\, {String} prop, {Function} callback");
        }
        if(hop(scope, prop)){
            callback();
        } else {
            timer = setInterval(function(){
                if(hop(scope, prop)){
                    clearInterval(timer);
                    callback();
                }
            }, every || 100);
        }
        var timer = null;
    }

    /**
     * @function mergeRecursive
     * @description Combine each object from left to right, keeping the left-most value
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {...(object|array)} objects Any number of objects/arrays to merge
     * @returns {boolean} True if null or undefined, false otherwise
     */
    v4.mergeRecursive = function(/* Any number of Object/Array */) {
        var newObj = null,
            j,
            curObj,
            recurse = function(obj1, obj2){
                var i,
                    val,
                    newT;

                if(!isNA(obj2)){
                    switch(obj2.constructor){
                        case Object:{
                            if(!isNA(obj1) && obj1.constructor == Object){
                                newT = dc(obj1);
                            } else {
                                newT = {};
                            }
                            for(i in obj2){
                                if(hop(obj2, i)){
                                    val = obj2[i];
                                    newT[i] = recurse(newT[i], obj2[i]);
                                }
                            }
                            return newT;
                        }break;

                        case Array:{
                            if(!isNA(obj1) && obj1.constructor == Array){
                                newT = dc(obj1);
                            } else {
                                newT = [];
                            }
                            for(i in obj2){
                                if(hop(obj2, i)){
                                    val = obj2[i];
                                    newT[i] = recurse(newT[i], obj2[i]);
                                }
                            }
                            return newT;
                        }break;

                        default:{
                            return obj2;
                        }
                    }
                } else {
                    return obj2;
                }
            };
        for(j in arguments){
            curObj = arguments[j];
            if(!isNA(curObj) && (curObj.constructor == Object || curObj.constructor == Array)){
                newObj = recurse(newObj, curObj);
            }
        }
        return newObj;
    }

    v4.docWidth = function(){
        return w.innerWidth ||
            w.documentElement.clientWidth ||
            w.body.clientWidth ||
            w.body.offsetWidth;
    }
    v4.docHeight = function(){
        return w.innerHeight ||
            w.documentElement.clientHeight ||
            w.body.clientHeight ||
            w.body.offsetHeight;
    }
    /**
     * @function gei
     * @description Minification shorthand for {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById Document.getElementById}
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} s The id of the searched element
     * @returns {Element|null} The Element, or null if not found
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
     */
    v4.gei = function(s,e) {return (e||d).getElementById(s); }
    /**
     * @function qs
     * @description Minification shorthand for {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector Element.querySelector}
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} s The selector of the searched element
     * @returns {Element|null} The Element, or null if not found
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
     */
    v4.qs = function(s,e) {return (e||d).querySelector(s); }
    /**
     * @function qsa
     * @description Minification shorthand for {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll Element.querySelectorAll}
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} s The selector of the searched element
     * @returns {NodeList} The NodeList containing every elements matching the selector
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
     */
    v4.qsa = function(s,e) {return (e||d).querySelectorAll(s); }
    /**
     * @function geiN
     * @description Like {@link Document.gei}, but returns an empty object instead of null to allow 1lvl attribute definition without tests
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} s The selector of the searched element
     * @returns {Element|{}} The Element, or an empty object if not found
     */
    v4.geiN = function(s,e) {return gei(s,e) || {}; }
    /**
     * @function qsN
     * @description Like {@link Element.qsN}, but returns an empty object instead of null to allow 1lvl attribute definition without tests
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} s The selector of the searched element
     * @returns {Element|{}} The Element, or an empty object if not found
     */
    v4.qsN = function(s,e) {return qs(s,e) || {}; }
    /**
     * @function hop
     * @description Minification shorthand for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty Object.hasOwnProperty}
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {string} v The name of the attribute
     * @returns {Boolean} Returns the same than {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty Object.hasOwnProperty}
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
     */
    v4.hop = function(s,v) {return s.hasOwnProperty(v); }
    /**
     * @function waitUntil
     * @description Minification shorthand for {@link HTMLDocument}.getElementById
     * @author Gerkin
     * @memberof Ithoughts.v4
     * @instance
     * @param {Function} until Function executed on each loop.
     * @param {Number} every Time to wait between each test.
     * @param {Number|false} [max=false]  Time after which `this` will be executed even if `until` still returns false. Set it to false to not set max timeout
     * @param s Minification helper. Do not use
     */
    v4.waitUntil = function(fct, until, every, max){
        if(isNA(until) || until.constructor.name !== "Function")
            throw TypeError('Calling "Function.waitUntil" without test function. Call setTimeout instead');

        max = !isNA(max) && !isNaN(parseInt(max)) ? parseInt(max) : false;
        setTimeout(function(){
            until() || (max !== false && max < 1) ? fct() : waitUntil(fct, until, every, max ? max - every : max)
        },every);
    }


    /**
     * @function on
     * @description Bind events with specified functions on specified elements
	 * @memberof Ithoughts.v4
	 * @alias Ithoughts.v4.attachEvent
     * @param {EventTarget|EventTarget[]}					a	EventTarget to bind
     * @param {string|string[]}					b	Events to bind
     * @param {EventFunction|EventFunction[]}	c	Functions to attach
     * @since 0.1.0
     */
    function on(a, b, c) {
        /**
         * @function _on
         * @description Same as {@link EventTarget#on}
         * @alias EventTarget.on
         * @param {string}			e Event to bind
         * @param {EventFunction}	f Function to attach
         * @private
         * @see Ithoughts.v4#on
         * @since 0.1.0
         */
        function _on(s, e, f) {
            var i = e && f && (s.addEventListener || s.attachEvent).call(s, e, f);
        }
        if (isNA(a) || a.constructor.name !== "Array") {a = [a]; }
        if (isNA(b) || b.constructor.name !== "Array") {b = [b]; }
        if (isNA(c) || c.constructor.name !== "Array") {c = [c]; }
        var i = 0, j = 0, k = 0, I = a.length, J = b.length, K = c.length;
        for (i = 0; i < I; i++) { for (j = 0; j < J; j++) { for (k = 0; k < K; k++) {
            a[i] instanceof et && _on(a[i], b[j], c[k]);
        } } }
    }
    v4.on = v4.attachEvent = on;

    /**
     * @function off
     * @description Unbind events with specified functions on specified elements
	 * @memberof Ithoughts.v4
	 * @alias Ithoughts.v4.detachEvent
     * @param {EventTarget|EventTarget[]}					a	EventTarget to unbind
     * @param {string|string[]}					b	Events to unbind
     * @param {EventFunction|EventFunction[]}	c	Functions to detach
     * @since 0.1.0
     */
    function off(a, b, c) {
        /**
         * @function _off
         * @description Same as {@link EventTarget#off}
         * @param {string}			e Event to unbind
         * @param {EventFunction}	f Function to detach
         * @private
         * @see Ithoughts.v4#off
         * @since 0.1.0
         */
        function _off(s, e, f) {
            var i = e && f && (s.removeEventListener || s.detachEvent).call(s, e, f);
        }
        if (isNA(a) || a.constructor.name !== "Array") {a = [a]; }
        if (isNA(b) || b.constructor.name !== "Array") {b = [b]; }
        if (isNA(c) || c.constructor.name !== "Array") {c = [c]; }
        var i = 0, j = 0, k = 0, I = a.length, J = b.length, K = c.length;
        for (i = 0; i < I; i++) {for (j = 0; j < J; j++) {for (k = 0; k < K; k++) {
            a[i] instanceof et && _off(a[i], b[j], c[k]);
        } } }
    }
    v4.off = v4.detachEvent = off;

    /**
     * @function go
     * @description Unbind events with specified functions on specified elements
	 * @memberof Ithoughts.v4
	 * @alias Ithoughts.v4.triggerEvent
     * @param {EventTarget|EventTarget[]}					a	EventTarget to trigger event on
     * @param {string|string[]}					b	Name of the events
     * @since 0.1.0
     */
    function go(a, b) {
        /**
         * @function _go
         * @description Same as {@link EventTarget#go}
         * @param {string}			b Event name
         * @param e Minification helper. Do not use
         * @private
         * @see Ithoughts.v4#go
         * @since 0.1.0
         */
        function _go(s, b, e) {
            if (b) {
                if (d.createEvent) {
                    e = new Event(b);
                    s.dispatchEvent(e);
                } else {
                    e = d.createEventObject();
                    s.fireEvent("on" + b, e);
                }
            }
        }
        if (isNA(a) || a.constructor.name !== "Array") {a = [a]; }
        if (isNA(b) || b.constructor.name !== "Array") {b = [b]; }
        var i = 0, j = 0, k = 0, I = a.length, J = b.length;
        for (i = 0; i < I; i++) { for (j = 0; j < J; j++) {
            a[i] instanceof et && _go(a[i], b[j]);
        } }
    }
    v4.go = v4.triggerEvent = go;

    if(jQuery){
        var $ = v4.$ = jQuery;
        v4.$d = $(document);
        v4.$w = $(window);
    }

    v4.isIos = navigator.userAgent.match(/(iPad|iPhone|iPod)/g); // Used to enable some iOS specific piece of code to catch click on body, for example
    v4.baseTouch = (v4.isIos || navigator.userAgent.match(/(Android|webOS|BlackBerry)/i) ) ? 1 : 0;


    v4.initLoggers = (function(){
        function generateLogArray(prefix, mode, args){
            args = Array.prototype.slice.call(args, 1);
            args.unshift(mode + "");
            args.unshift(prefix + " => ");
            return args;
        }
        return function(plugin_core, text_prefix, verbosity){
            if(typeof verbosity == "string"){
                verbosity = parseInt(verbosity);
            }

            var modes = ["error", "warn", "info", "log"],
                mode;
            for(var i = 0, I = modes.length; i < I; i++){
                mode = modes[i];
                if(!plugin_core.hasOwnProperty(mode)){
                    plugin_core[mode] = verbosity > i ? (function(modeIn){
                        console[modeIn].apply(null, generateLogArray(text_prefix, modeIn.toUpperCase(), arguments));
                    }).bind(null, mode) : function(){};
                }
            }
        };
    }());
    v4.makeLoader = function(){
        $("#publish,#adminmenu li.wp-has-current-submenu a.wp-has-current-submenu, #adminmenu li.current a.menu-top, .folded #adminmenu li.wp-has-current-submenu, .folded #adminmenu li.current.menu-top, #adminmenu .wp-menu-arrow, #adminmenu .wp-has-current-submenu .wp-submenu .wp-submenu-head, #adminmenu .wp-menu-arrow div")
        var loader = $($.parseHTML('<div class="ithoughts_tt_gl-loader" data-loader-status="shown"><div class="centerer"><div class="loader"></div></div></div>'));
        loader.find(".loader,.loader:before,.loader:after").css({borderTopColor: $("#adminmenu li.wp-has-current-submenu a.wp-has-current-submenu, #adminmenu li.current a.menu-top, .folded #adminmenu li.wp-has-current-submenu, .folded #adminmenu li.current.menu-top, #adminmenu .wp-menu-arrow, #adminmenu .wp-has-current-submenu .wp-submenu .wp-submenu-head, #adminmenu .wp-menu-arrow div,#publish").css("background-color")})
        loader.find(".centerer").css({backgroundColor: $("#wpadminbar").css("background-color")})
        $("body").append(loader);
        return loader;
    }
}(Ithoughts));