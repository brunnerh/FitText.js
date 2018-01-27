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
    /**
     * Creates a new token.
     * @param {() => void} callback The callback, that executes the cancellation logic.
     */
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
   * @param {EventTarget} element The element on which to add the listener.
   * @param {string} type The type of the event.
   * @param {EventListenerOrEventListenerObject} listener The event listener or listener object.
   * @param {boolean | AddEventListenerOptions} options Event listener options.
   * @returns {CancellationToken} A cancellation token.
   */
  const addEvent = (element, type, listener, options = false) =>
  {
    element.addEventListener(type, listener, options);

    return new CancellationToken(() => element.removeEventListener(type, listener, options));
  }

  const extend = function (target, source)
  {
    for (const key in source)
      if (source.hasOwnProperty(key))
        target[key] = source[key];

    return target;
  };

  /**
   * Fits the text contents of an element to the element's width.
   * @param {HTMLElement} element The element whose text contents to resize.
   * @param {number} compressor A sizing factor. Default: 1
   * @param {Object} options Various options.
   * @param {number=} options.minFontSize The minimal font size.
   * @param {number=} options.maxFontSize The maximal font size.
   * @param {number=} options.updateRate Sets the update rate in milliseconds if ResizeObserver is not supported. Default: 1000
   * @returns {CancellationToken} A cancellation token, which removes any event listeners.
   */
  self['fitText'] = function (element, compressor = 1, options = {})
  {
    const settings = extend({
      minFontSize: -1 / 0,
      maxFontSize: 1 / 0,
      updateRate: 1000
    }, options);

    const fit = function (/** @type {HTMLElement} */ element)
    {
      const resize = function ()
      {
        element.style.fontSize = Math.max(Math.min(element.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
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
        obs.observe(element);
  
        tokens.push(new CancellationToken(() => obs.disconnect()));
      }
      else
      {
        // Interval-based update (window resize is not reliable as it does not capture internal layout changes)
        const handle = setInterval(resize, settings.updateRate);
  
        tokens.push(new CancellationToken(() => clearInterval(handle)));
      }

      return new CancellationToken(() => tokens.forEach(t => t.cancel()));
    };

    return fit(element);
  };
})();