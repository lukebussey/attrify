import querystring from 'querystring';
import cookie from 'cookie';
import merge from 'deepmerge';

const decode = decodeURIComponent;

/**
 * attribution
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
const attribution = (opts) => {
  let options = {
    defaults: true,
    prefix: '',
    saveInitial: false,
    initialPrefix: 'initial_',
    lastPrefix: '',
    params: [
      'utm_campaign',
      'utm_source',
      'utm_medium',
      'utm_term',
      'utm_content',
    ],
    data: {
      referrer: global.document.referrer !== '' ? global.document.referrer : 'direct',
    },
    path: '/',
    domain: null,
    timeout: 30,
    sameSite: 'none',
    secure: true,
  };

  const pageQueryString = getQueryString();
  let data = {};
  let cookieOptions = {};
  const now = new Date();
  let expires;

  // Remove default parameters if necessary
  if (typeof opts === 'object') {
    if (typeof opts.defaults !== 'undefined' && opts.defaults === false) {
      options.params = [];
    }
  }

  // Merge opts onto options
  if (typeof opts === 'object') {
    options = merge(options, opts);
  }

  const dataKeys = Object.keys(options.data);

  // Set default cookie options
  cookieOptions = {
    domain: options.domain,
    path: options.path,
    sameSite: options.sameSite,
    secure: options.secure,
  };

  // Set cookie expiration and advance expiration for existing cookies
  if (options.timeout) {
    expires = new Date(now.setMinutes(now.getMinutes() + options.timeout));

    // querystring param cookies
    options.params.forEach((key) => {
      updateExpiration(options.prefix + options.lastPrefix + key, expires, cookieOptions);
    });

    // data object cookies
    if (dataKeys.length !== 0) {
      dataKeys.forEach((key) => {
        updateExpiration(options.prefix + options.lastPrefix + key, expires, cookieOptions);
      });
    }
  }

  // Parse the query string
  if (pageQueryString.length !== 0) {
    data = querystring.parse(pageQueryString);
  }

  // Create initial cookies
  if (options.saveInitial) {
    options.params.forEach((key) => {
      if (!getCookie(options.prefix + options.initialPrefix + key)) {
        setCookie(options.prefix + options.initialPrefix + key, data[key] || 'null', merge(cookieOptions, {
          expires: new Date('Tue 19 Jan 2038 03:14:07 GMT'),
        }));
      }
    });
  }

  // Create the cookies
  let removed = false;

  options.params.forEach((key) => {
    if (data[key]) {
      // param found in querystring so remove all necessary existing cookies first
      if (!removed) {
        removeCookies(options, cookieOptions);
        removed = true;
      }

      // Merge expires in to prevent the following error:
      // Uncaught TypeError: opt.expires.toUTCString is not a function
      setCookie(options.prefix + options.lastPrefix + key, data[key], merge(cookieOptions, {
        expires,
      }));
    }
  });

  // Save the data object
  if (dataKeys.length !== 0) {
    dataKeys.forEach((key) => {
      // Skip undefined, null, or empty values
      if (typeof options.data[key] === 'undefined' || options.data[key] === null || options.data[key] === '') {
        return;
      }

      // Create initial cookies
      if (options.saveInitial) {
        if (!getCookie(options.prefix + options.initialPrefix + key)) {
          setCookie(options.prefix + options.initialPrefix + key, options.data[key], merge(cookieOptions, {
            expires: new Date('Tue 19 Jan 2038 03:14:07 GMT'),
          }));
        }
      }

      // Create session cookies if they don't exist
      if (!getCookie(options.prefix + options.lastPrefix + key)) {
        setCookie(options.prefix + options.lastPrefix + key, options.data[key], merge(cookieOptions, {
          expires,
        }));
      }
    });
  }
};

/**
 * Remove all cookies matching options.params
 * @param  {Object} options
 * @private
 */
const removeCookies = (options, cookieOptions) => {
  options.params.forEach((key) => {
    global.document.cookie = cookie.serialize(options.prefix + options.lastPrefix + key, '', merge(cookieOptions, {
      expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    }));
  });
};

/**
 * Returns the query string without its initial question mark.
 *
 * E.g. foo=bar&baz=qux
 *
 * @return {string}
 * @private
 */
const getQueryString = () => global.window.location.search.substring(1);

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
const setCookie = (name, value, options) => {
  global.document.cookie = cookie.serialize(name, value, options);
};

/**
 * Returns cookie value
 *
 * @param {string} name - name of cookie
 * @return {string} token
 * @private
 */
const getCookie = (name) => {
  const match = global.document.cookie.match(`(?:^|; )${name}=([^;]+)`);

  if (match) {
    return decode(match[1]);
  }
  return null;
};

/**
 * Update cookie expiration
 *
 * @param {string} name - name of cookie
 * @param {date} expires - expiration date/time of cookie
 * @param {object} options - object containing cookie options
 * @private
 */
const updateExpiration = (name, expires, options) => {
  const existingValue = getCookie(name);

  if (existingValue) {
    setCookie(name, existingValue, merge(options, {
      expires,
    }));
  }
};

export default attribution;
