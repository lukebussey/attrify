# Attrify for Marketing Attribution
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Floganbussey%2Fattrify.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Floganbussey%2Fattrify?ref=badge_shield)


Attrify saves a user’s last referrer and campaign (utm) query string parameters as session cookies. The cookies can then be passed to your marketing automation system, CRM, or email marketing system at any time during the users session for enhanced marketing attribution.

By default, only the `referrer` `utm_campaign`, `utm_source`, `utm_medium`, `utm_content`, and `utm_term` are saved. Extra query string parameters can also be saved by passing them in via the `options.params` object. If the query string contains any of the parameters to be saved, a new session is assumed and previously set cookies will be overwritten. Initial value cookies can be set by enabling the `saveInitial` option and are not overwritten at any time.

`attrify()` should be called on each page view and all pages of your site.

Note: This is currently a browser only module because it reads the query string from `window.location.search` and sets cookies via `document.cookie`. It could however be easily be modified to run as an express middleware and work on the server side.

Attrify is a fork and improvement of my previous project [Last Campaign](https://github.com/Yesware/last-campaign).

## Installation & Usage

### NPM
`$ npm i @loganbussey/attrify --save`

```js
import attrify from '@loganbussey/attrify';
attrify();
```

## Options

### `timeout` (Number)

Default session timeout in minutes. This should match the session timeout used in Google Analytics. Default `30`

Passing in `null` will disable the session timeout and revert to using a session cookie. E.g. `timeout: null`

### `prefix` (String)

Global cookie name prefix. Default `''`

### `saveInitial` (Boolean)

Save persistent initial cookies. Setting this to `true` will create all persistent `initial_` prefixed cookies. Default `false`

### `initialPrefix` (String)

Initial cookie name prefix. Default `'initial_'`

### `lastPrefix` (String)

Session cookie name prefix. Default `''`

### `params` (Array)

An array of additional query string parameters to save. E.g. `['gclid']`.

### `data` (Object)

An object of additional values to save. Values are only saved once per session.

### `defaults` (Boolean)

Specify if the default parameters, `initial_utm_campaign`, `initial_utm_source`, `initial_utm_medium`, `initial_utm_content`, `initial_utm_term`, `utm_campaign`, `utm_source`, `utm_medium`, `utm_content`, and `utm_term` should be saved. Default `true`

### `domain` (String)

Specify a domain to set cookie on. If you want this to work across all of your sub-domains, set this to your domain name prefixed with a period. E.g. `.google.com`

Default `null`

### `path` (String)

Cookie path.

Default `/`

### `sameSite` (String)

Cookie SameSite attribute.

Default `None`

### `secure` (Boolean)

Cookie secure attribute.

Default `true`

## Examples

### Save default parameters accessible from all sub-domains

```js
const cookieDomain = window.location.hostname.indexOf('domain.com') >= 0 ? '.domain.com' : null;

attrify({
  domain: cookieDomain
});
```

### Save `gclid` AdWords ID in addition to default parameters
```js
attrify({
  params: ['gclid']
});
```

### Save only the `foo` parameter with an `_` prefix
```js
attrify({
  prefix: '_',
  defaults: false,
  params: ['foo']
});
```

### Save `foo` value in addition to default parameters
```js
attrify({
  data: {
    foo: 'bar'
  }
});
```

## MIT License

Copyright © 2019 Logan Bussey, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Floganbussey%2Fattrify.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Floganbussey%2Fattrify?ref=badge_large)