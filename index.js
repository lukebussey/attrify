'use strict';

var querystring = require('querystring');
var cookie = require('cookie');
var merge = require('deepmerge');

/**
 * Module exports.
 * @public
 */
module.exports = attribution;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;

/**
 * saveLastCampaign
 *
 * Saves campaign query string parameters into a session cookie so they can be
 * retrieved and passed to your marketing automation system when needed.
 *
 * @param {object} [opts] Options object.
 * @param {string} [opts.prefix] Cookie name prefix.
 * @param {array}  [opts.params] Default parameters.
 * @param {array}  [opts.extra]  Extra parameters.
 * @public
 */
function attribution(opts) {

  var options = {
    defaults: true,
    prefix: '',
    initialPrefix: 'initial_',
    lastPrefix: '',
    params: [
      'utm_campaign',
      'utm_source',
      'utm_medium',
      'utm_term',
      'utm_content'
    ],
    data: {
      referrer: document.referrer !== '' ? document.referrer : 'direct'
    },
    path: '/',
    domain: null,
    timeout: 30
  };

  var pageQueryString = getQueryString();
  var data = {};
  var cookieOptions = {};
  var now = new Date();
  var expires;

  // Remove default parameters if necessary
  if (typeof opts === 'object') {
    if (typeof opts.defaults !== 'undefined' && opts.defaults === false) {
      options.params = [];
    }
  }

  // Merge opts onto options
  if (arguments.length && typeof opts === 'object') {
    options = merge(options, opts);
  }

  var dataKeys = Object.keys(options.data);

  // Set default cookie options
  cookieOptions = {
    domain: options.domain,
    path: options.path
  };

  // Set cookie expiration and advance expiration for existing cookies
  if (options.timeout) {
    expires = new Date(now.setMinutes(now.getMinutes() + options.timeout));

    // querystring param cookies
    options.params.forEach(function (key) {
      updateExpiration(options.prefix + options.lastPrefix + key, expires, cookieOptions);
    });

    // data object cookies
    if (dataKeys.length !== 0) {
      dataKeys.forEach(function (key) {
        updateExpiration(options.prefix + options.lastPrefix + key, expires, cookieOptions);
      });
    }
  }

  // Parse the query string
  if (pageQueryString.length !== 0) {

    data = querystring.parse(pageQueryString);

    // Create initial cookies
    options.params.forEach(function (key) {
      if (data[key] && !getCookie(options.prefix + options.initialPrefix + key)) {

        setCookie(options.prefix + options.initialPrefix + key, data[key], merge(cookieOptions, {
          expires: new Date('Tue 19 Jan 2038 03:14:07 GMT')
        }));

      }
    });

    // Create the cookies
    var removed = false;

    options.params.forEach(function (key) {
      if (data[key]) {

        // param found in querystring so remove all necessary existing cookies first
        if (!removed) {
          removeCookies(options, cookieOptions);
          removed = true;
        }

        // Merge expires in to prevent the following error:
        // Uncaught TypeError: opt.expires.toUTCString is not a function
        setCookie(options.prefix + options.lastPrefix + key, data[key], merge(cookieOptions, {
          expires: expires
        }));
      }
    });
  }

  // Save the data object
  if (dataKeys.length !== 0) {
    dataKeys.forEach(function (key) {

      // Skip undefined, null, or empty values
      if (typeof options.data[key] === 'undefined' || options.data[key] === null || options.data[key] === '') {
        return;
      }

      // Create initial cookies
      if (!getCookie(options.prefix + options.initialPrefix + key)) {
        setCookie(options.prefix + options.initialPrefix + key, options.data[key], merge(cookieOptions, {
          expires: new Date('Tue 19 Jan 2038 03:14:07 GMT')
        }));
      }

      // Create session cookies if they don't exist
      if (!getCookie(options.prefix + options.lastPrefix + key)) {
        setCookie(options.prefix + options.lastPrefix + key, options.data[key], merge(cookieOptions, {
          expires: expires
        }));
      }
    });
  }

}

/**
 * Remove all cookies matching options.params
 * @param  {Object} options
 * @private
 */
function removeCookies(options, cookieOptions) {
  options.params.forEach(function (key) {
    document.cookie = cookie.serialize(options.prefix + options.lastPrefix + key, '', merge(cookieOptions, {
      expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT')
    }));
  });
}

/**
 * Returns the query string without its initial question mark.
 *
 * E.g. foo=bar&baz=qux
 *
 * @return {string}
 * @private
 */
function getQueryString() {
  return window.location.search.substring(1);
}

/**
 * Sets a browser cookie given a valid cookie string.
 *
 * E.g. "foo=bar; httpOnly"
 *
 * @param {string} name - name of cookie
 * @param {string} value - value of cookie
 * @param {object} options - object containing cookie options
 * @private
 */
function setCookie(name, value, options) {
  document.cookie = cookie.serialize(name, value, options);
}

/**
 * Returns cookie value
 *
 * @param {string} name - name of cookie
 * @return {string} token
 * @private
 */
function getCookie(name) {
  if (arguments.length === 0 && typeof opts !== 'string') {
    return;
  }

  var match = document.cookie.match('(?:^|; )' + name + '=([^;]+)');

  if (match) {
    return decode(match[1]);
  } else {
    return '';
  }
}

/**
 * Update cookie expiration
 *
 * @param {string} name - name of cookie
 * @param {date} expires - expiration date/time of cookie
 * @param {object} options - object containing cookie options
 * @private
 */
function updateExpiration(name, expires, options) {
  var existingValue = getCookie(name);

  if (existingValue) {
    setCookie(name, existingValue, merge(options, {
      expires: expires
    }));
  }
}
