import { settings } from '~/config';

import {
  flattenToAppURL,
  flattenHTMLToAppURL,
  getBaseUrl,
  getIcon,
  getView,
  isInternalURL,
} from './Url';

describe('Url', () => {
  describe('getBaseUrl', () => {
    it('can remove a view name from an absolute url', () => {
      expect(getBaseUrl('http://localhost/edit')).toBe('http://localhost');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/contents')).toBe('');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/edit')).toBe('');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/register')).toBe('');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/password-reset')).toBe('');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/password-reset/token')).toBe('');
    });
    it('can remove a view name from a controlpanel url', () => {
      expect(getBaseUrl('/controlpanel/date-time')).toBe('');
    });
    it('it does not match inner parts, only last ones', () => {
      expect(getBaseUrl('/bla/doh/history/doh/bla')).toBe(
        '/bla/doh/history/doh/bla',
      );
    });
    it('it does not match inner parts, only last ones II', () => {
      expect(getBaseUrl('/bla/doh/sharing-my-test/doh/bla')).toBe(
        '/bla/doh/sharing-my-test/doh/bla',
      );
    });
  });

  describe('getView', () => {
    it('can get the edit view from the url', () => {
      expect(getView('http://localhost/edit')).toBe('edit');
    });

    it('can get the view view from the url', () => {
      expect(getView('http://localhost/my-blog')).toBe('view');
    });
  });

  describe('getIcon', () => {
    it('returns an icon for a document', () => {
      expect(getIcon('Document', false)).toBe('file text outline');
    });

    it('returns an icon for an image', () => {
      expect(getIcon('Image', false)).toBe('file image outline');
    });

    it('returns an icon for a file', () => {
      expect(getIcon('File', false)).toBe('attach');
    });

    it('returns an icon for a link', () => {
      expect(getIcon('Link', false)).toBe('linkify');
    });

    it('returns an icon for an event', () => {
      expect(getIcon('Event', false)).toBe('calendar');
    });

    it('returns an icon for a folderish item', () => {
      expect(getIcon('Custom', true)).toBe('folder open outline');
    });

    it('returns an icon for a non folderish item', () => {
      expect(getIcon('Custom', false)).toBe('file outline');
    });
  });

  describe('flattenToAppURL', () => {
    it('flattens a given URL to the app URL', () => {
      expect(flattenToAppURL(`${settings.apiPath}/edit`)).toBe('/edit');
    });
  });
  describe('flattenHTMLToAppURL', () => {
    it('flattens all occurences of the api URL from an html snippet', () => {
      const html = `<a href="${settings.apiPath}/foo/bar">An internal link</a><a href="${settings.apiPath}/foo/baz">second link</a>`;
      expect(flattenHTMLToAppURL(html)).toBe(
        '<a href="/foo/bar">An internal link</a><a href="/foo/baz">second link</a>',
      );
    });
  });
  describe('isInternalURL', () => {
    it('tells if an URL is internal or not', () => {
      const href = `${settings.apiPath}/foo/bar`;
      expect(isInternalURL(href)).toBe(true);
    });
    it('tells if an URL is internal if it is an anchor', () => {
      const href = '#anchor';
      expect(isInternalURL(href)).toBe(true);
    });
  });
});
