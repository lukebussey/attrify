# Last Campaign

Saves the last campaign (utm) query string parameters found on the current URL into a session cookie; so that they can be passed to your marketing automation system at any time during the users session.

By default, only `utm_campaign`, `utm_source`, `utm_medium`, `utm_content`, and `utm_term` are saved. Extra parameters can also be saved by passing them in via the `options.params` object.

`lastCampaign()` should be called on each page view.

Note: This is currently a browser only module because it reads the query string from `window.location.search` and sets cookies via the `document.cookie`. It could however, easily be modified to run as an express middleware and work on the server side.

## Installation & Usage

### NPM
`$ npm install last-campaign`

```
var lastCampaign = require('last-campaign');
lastCampaign();
```

### Bower
`$ bower install last-campaign`

```
lastCampaign();
```

## Options

### `prefix` (String)

Cookie name prefix. Default `''`

### `params` (Array)

An array of additional query string parameters to save. E.g. `['gclid']`.

### `defaults` (Boolean)

Specify if the default parameters, `utm_campaign`, `utm_source`, `utm_medium`, `utm_content`, and `utm_term` should be saved. Default `true`

## Examples

### Save `gclid` AdWords ID in addition to default parameters
```
lastCampaign({
    params: ['gclid']
});
```

### Save only the `foo` parameter with an `_` prefix
```
lastCampaign({
    prefix: '_',
    defaults: false,
    params: ['foo']
});
```

## MIT License

Copyright © 2016 Yesware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
