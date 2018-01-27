/*!	
* FitText.js 1.1 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com 
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
* Modified by Slawomir Kolodziej http://slawekk.info
* Modified by brunnerh https://github.com/brunnerh
*
* Date: 2018-01-27T10:03:40.775Z
*/

// @ts-check

(function ()
{
  /** Utility class for cancelling something in a non-leaky way. */
  class CancellationToken
  {
    constructor(callback)
    {
      this._callback = callback;
      this.cancel = () =>
      {
        if (this._callback == null)
          return;

        this._callback();
        this._callback = null;
      }
    }
  }

  /**
   * Adds an event listener.
   * @param {EventTarget} el The element on which to add the listener.
   * @param {string} type The type of the event.
   * @param {EventListenerOrEventListenerObject} fn The event callback.
   * @param {boolean | AddEventListenerOptions} options Event listener options.
   * @returns {CancellationToken} A cancellation token.
   */
  const addEvent = (el, type, fn, options = false) =>
  {
    el.addEventListener(type, fn, options);

    return new CancellationToken(() => el.removeEventListener(type, fn, options));
  }

  var extend = function (obj, ext)
  {
    for (var key in ext)
      if (ext.hasOwnProperty(key))
        obj[key] = ext[key];
    return obj;
  };

  /**
   * 
   * @param {HTMLElement} el The element whose text contents to resize.
   * @param {number} kompressor A sizing factor.
   * @param {Object} options Sizing options.
   * @param {number=} options.minFontSize The minimal font size.
   * @param {number=} options.maxFontSize The maximal font size.
   * @returns {CancellationToken} A cancellation token, which removes any event listeners.
   */
  self['fitText'] = function (el, kompressor, options = {})
  {
    const settings = extend({
      'minFontSize': -1 / 0,
      'maxFontSize': 1 / 0
    }, options);

    const fit = function (/** @type {HTMLElement} */ el)
    {
      const compressor = kompressor || 1;

      const resize = function ()
      {
        el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
      };

      // Call once to set.
      resize();

      // Bind events
      const tokens = [
        addEvent(window, 'resize', resize),
        addEvent(window, 'orientationchange', resize)
      ];

      if ('ResizeObserver' in self)
      {
        const obs = new self['ResizeObserver'](() => resize());
        obs.observe(el);
  
        tokens.push(new CancellationToken(() => obs.disconnect()));
      }
      else
      {
        // Slow polling update (window resize is not reliable as it does not capture internal layout changes)
        const handle = setInterval(resize, 1000);
  
        tokens.push(new CancellationToken(() => clearInterval(handle)));
      }

      return new CancellationToken(() => tokens.forEach(t => t.cancel()));
    };

    return fit(el);
  };
})();
