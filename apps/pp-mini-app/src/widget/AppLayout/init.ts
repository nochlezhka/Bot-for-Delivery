import { miniApp } from '@telegram-apps/sdk';
import {
  backButton,
  init as initSDK,
  setDebug,
  themeParams,
  viewport,
} from '@telegram-apps/sdk-react';

export function init(debug: boolean): void {
  import('eruda').then((m) => {
    m.default.init();
  });
  setDebug(debug);
  initSDK({
    acceptCustomStyles: true,
  });
  backButton.isSupported() && backButton.mount();
  miniApp.mountSync();
  themeParams.mountSync();
  viewport
    .mount()
    .then(() => {
      viewport.bindCssVars();
      themeParams.bindCssVars();
      miniApp.bindCssVars();
    })
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e);
    });
}
