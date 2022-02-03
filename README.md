# timer ⏳
**Drop-in replacement for standard JavaScript timer functions[^1] using Web Workers.**

#
Most browsers now limit timers to firing at most once per second when the window or tab loses focus.
By utilizing Web Workers, unfocused sites can still use timers with the expected granularity.
Just include `<script src="timer.js">` before any scripts that utilize timers and enjoy!

[^1]: https://developer.mozilla.org/en-US/docs/Web/API/setInterval  
  https://developer.mozilla.org/en-US/docs/Web/API/setTimeout  
  https://developer.mozilla.org/en-US/docs/Web/API/clearInterval  
  https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout
