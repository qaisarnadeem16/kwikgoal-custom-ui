import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { DialogsRenderer } from './components/dialog/Dialogs';
import 'react-tooltip/dist/react-tooltip.css'

// The 3D viewer's canvas (and the new grid layouts) resize themselves in
// response to their own ResizeObserver callbacks, which can trigger this
// harmless browser warning. It has no effect on functionality, but CRA's dev
// error overlay treats it as an uncaught error.
//
// Trying to catch and swallow the resulting error event is unreliable: CRA's
// dev-server overlay script registers its own window "error" listener before
// this file even runs, so it can see the event first regardless of capture
// phase. The robust fix is to stop the warning from being thrown at all, by
// deferring each ResizeObserver callback to the next animation frame so it
// never gets far enough into its own resize cycle to trip the loop check.
if (typeof window.ResizeObserver !== 'undefined') {
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      });
    }
  };
}

const RESIZE_OBSERVER_LOOP_MESSAGES = [
  'ResizeObserver loop completed with undelivered notifications.',
  'ResizeObserver loop limit exceeded',
];
window.addEventListener(
  'error',
  (event) => {
    if (RESIZE_OBSERVER_LOOP_MESSAGES.includes(event.message)) {
      event.stopImmediatePropagation();
    }
  },
  { capture: true }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
