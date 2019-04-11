import {expect} from 'chai';
import {jsdom} from 'jsdom';
import cookie from 'cookie';
import attrify from '../src/index.js';

let cookieData = {};

beforeEach(() => {
  global.document = jsdom('', {
    url: 'http://www.lukebussey.com/',
    referrer: 'https://www.google.com',
  });
  global.window = global.document.defaultView;
});

describe('attrify', () => {
  it('should set the correct cookies by default', () => {
    attrify();

    cookieData = cookie.parse(document.cookie);

    expect(cookieData).to.not.have.all.keys('initial_referrer',
                                            'initial_utm_campaign',
                                            'initial_utm_medium',
                                            'initial_utm_source',
                                            'initial_utm_term',
                                            'initial_utm_content');

    expect(cookieData.referrer).to.equal('https://www.google.com');

  });

  it('should set initial cookies if specified', () => {

    attrify({
      saveInitial: true
    });

    cookieData = cookie.parse(document.cookie);

    expect(cookieData).to.have.all.keys('referrer',
                                        'initial_referrer',
                                        'initial_utm_campaign',
                                        'initial_utm_medium',
                                        'initial_utm_source',
                                        'initial_utm_term',
                                        'initial_utm_content');

    expect(cookieData.initial_referrer).to.equal('https://www.google.com');
    expect(cookieData.referrer).to.equal('https://www.google.com');
    expect(cookieData.initial_utm_campaign).to.equal('null');
    expect(cookieData.initial_utm_medium).to.equal('null');
    expect(cookieData.initial_utm_source).to.equal('null');
    expect(cookieData.initial_utm_content).to.equal('null');
    expect(cookieData.initial_utm_term).to.equal('null');

  });

  describe('with a query string', () => {
    beforeEach(() => {
      window.location.href = '/path/?foo=bar&utm_campaign=test&utm_medium=test&utm_source=test&utm_term=test&utm_content=test';
    });

    it('should only set the correct cookies', () => {
      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
    });

    it('should only set the specified cookies', () => {
      attrify({
        defaults: false,
        params: ['utm_source', 'utm_medium'],
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_medium',
                                          'utm_source');

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
    });

    it('should set specified extra cookies', () => {
      attrify({
        params: ['foo'],
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content',
                                          'foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
      expect(cookieData.foo).to.equal('bar');
    });

    it('should only set the specified cookie', () => {
      attrify({
        defaults: false,
        params: ['foo'],
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer', 'foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.foo).to.equal('bar');
    });

    it('should use the specified cookie prefix', () => {
      attrify({
        prefix: '_',
        lastPrefix: 'last_',
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      /* eslint-disable no-underscore-dangle */
      expect(cookieData).to.have.all.keys('_last_referrer',
                                          '_last_utm_campaign',
                                          '_last_utm_medium',
                                          '_last_utm_source',
                                          '_last_utm_term',
                                          '_last_utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData._last_referrer).to.equal('https://www.google.com');
      expect(cookieData._last_utm_campaign).to.equal('test');
      expect(cookieData._last_utm_medium).to.equal('test');
      expect(cookieData._last_utm_source).to.equal('test');;
      expect(cookieData._last_utm_content).to.equal('test');
      expect(cookieData._last_utm_term).to.equal('test');
      /* eslint-enable no-underscore-dangle */
    });

    it('should set cookies with the correct sub-domain', () => {
      attrify({
        domain: '.lukebussey.com',
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
    });

    it('should set cookies with the correct sub-domain', () => {
      attrify({
        domain: '.notlukebussey.com',
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.not.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');
    });

    it('should set cookies with the correct path', () => {
      attrify({
        path: '/path/',
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
    });

    it('should set cookies with the correct path', () => {
      attrify({
        path: '/different-path/',
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.not.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');
    });

    it('should remove any previously set cookies', () => {
      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');

      window.location.href = '/path/?foo=bar&utm_campaign=test';

      attrify();

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
    });
  });

  describe('with additional data', () => {
    beforeEach(() => {
      window.location.href = '/path/?foo=bar&utm_campaign=test&utm_medium=test&utm_source=test&utm_term=test&utm_content=test';
    });

    it('should only set the correct cookies', () => {
      attrify({
        data: {
          baz: 'qux',
        },
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content',
                                              'initial_baz');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_campaign',
                                          'utm_medium',
                                          'utm_source',
                                          'utm_term',
                                          'utm_content',
                                          'baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_campaign).to.equal('test');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.utm_content).to.equal('test');
      expect(cookieData.utm_term).to.equal('test');
      expect(cookieData.baz).to.equal('qux');
    });

    it('should only set the specified cookies', () => {
      attrify({
        defaults: false,
        params: ['utm_source', 'utm_medium'],
        data: {
          baz: 'qux',
        },
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content',
                                              'initial_baz');

      expect(cookieData).to.have.all.keys('referrer',
                                          'utm_medium',
                                          'utm_source',
                                          'baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.utm_medium).to.equal('test');
      expect(cookieData.utm_source).to.equal('test');
      expect(cookieData.baz).to.equal('qux');
    });

    it('should only set the specified cookie', () => {
      attrify({
        defaults: false,
        data: {
          baz: 'qux',
        },
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_baz');

      expect(cookieData).to.have.all.keys('referrer','baz');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.baz).to.equal('qux');
    });

    it('should not set null, undefined or empty cookies', () => {
      let qux;

      attrify({
        defaults: false,
        data: {
          baz: qux,
          wibble: null,
          wobble: '',
          wubble: 0,
          fibble: true,
          fubble: false,
        },
      });

      cookieData = cookie.parse(document.cookie);

      expect(cookieData).to.not.have.all.keys('initial_referrer',
                                              'initial_utm_campaign',
                                              'initial_utm_medium',
                                              'initial_utm_source',
                                              'initial_utm_term',
                                              'initial_utm_content',
                                              'initial_wubble',
                                              'initial_fibble',
                                              'initial_fubble');

      expect(cookieData).to.have.all.keys('referrer',
                                          'wubble',
                                          'fibble',
                                          'fubble');

      expect(cookieData).to.not.have.any.keys('foo');

      expect(cookieData.referrer).to.equal('https://www.google.com');
      expect(cookieData.wubble).to.equal('0');
      expect(cookieData.fibble).to.equal('true');
      expect(cookieData.fubble).to.equal('false');
    });
  });
});
