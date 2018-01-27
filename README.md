# FitText.js, a <del>jQuery plugin</del> quite tiny script for inflating web type

FitText makes font-sizes flexible. Use this <del>plugin</del> script on your fluid or responsive layout to achieve scalable headlines that fill the width of a parent element.

## How it works

If you have a small site and do not want to attach jQuery, just attach `fittext.js` and put this just before `</body>` (`responsive_headline` is a header ID).

```html
<script>
  window.fitText(document.getElementById("responsive_headline"));
</script>
```

The function should only be called once on a given element, as various events are listened to, to update the size automatically.

### Options

The second argument to `fitText` can be used to set various options.

#### `minFontSize` & `maxFontSize`

These options ensure that the calculated font size does not exceed the respective bounds.

#### `compressor`

The default setting works pretty well, but when it doesn't FitText has one setting you can adjust. If your text resizes poorly or is resizing all hurdy gurdy, you'll want to turn the compressor up/down. It works a little like a guitar amp.

```js
// Turn the compressor up (font will shrink a bit more aggressively)
fitText(element, { compressor: 1.2 });
// Turn the compressor down (font will shrink less aggressively)
fitText(element, { compressor: 0.8 });
```

This will hopefully give you a level of "control" that might not be pixel perfect, but scales smoothly & nicely.

#### `updateRate`

If the browser does not support [`ResizeObserver`](https://caniuse.com/#feat=resizeobserver), the script updates the size in set intervals. This option sets this interval. By default the interval is one second (1000ms).

### Removing the Automatic Sizing Behavior

The function `fitText` returns a cancellation token. Call `cancel()` on it to unsubscribe from all events and cancel any update intervals.

```js
const token = fitText(element);
// Later
token.cancel();
```

## Thanks
Thanks to Trent, Dave and Reagan for original FitText.js: https://github.com/davatron5000/FitText.js
http://fittextjs.com/ 
