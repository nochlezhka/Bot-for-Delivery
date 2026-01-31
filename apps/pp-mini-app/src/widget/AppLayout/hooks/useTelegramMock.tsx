import type { ThemeParams } from '@telegram-apps/types';

import { emitEvent, mockTelegramEnv } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

const noInsets = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
} as const;
const themeParams: ThemeParams = {
  accent_text_color: '#6ab2f2',
  bg_color: '#17212b',
  button_color: '#5288c1',
  button_text_color: '#ffffff',
  destructive_text_color: '#ec3942',
  header_bg_color: '#17212b',
  hint_color: '#708499',
  link_color: '#6ab3f3',
  secondary_bg_color: '#232e3c',
  section_bg_color: '#17212b',
  section_header_text_color: '#6ab3f3',
  subtitle_text_color: '#708499',
  text_color: '#f5f5f5',
} as const;

const auth_date = Math.floor(Date.now() / 1000).toString();
const user = JSON.stringify({ first_name: 'Pavel', id: 1 });

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
  useEffect(() => {
    (async () => {
      const shouldMock = process.env.NEXT_PUBLIC_MOCK_ENV === '1';
      if (shouldMock) {
        const hash =
          'b6369c376c3fcc466b91e89241476b4cf679528b7968b7339b99ff42ef814f2e';
        const signature = 'knnfIxk_sHa7ngM8BuNaYtN7_mUnZpUNI0';
        mockTelegramEnv({
          launchParams: {
            tgWebAppData: new URLSearchParams([
              ['user', user],
              ['hash', hash],
              ['signature', signature],
              ['auth_date', auth_date],
            ]),
            tgWebAppPlatform: 'tdesktop',
            tgWebAppStartParam: 'debug',
            tgWebAppThemeParams: themeParams,
            tgWebAppVersion: '8',
          },
          onEvent(e) {
            if (e[0] === 'web_app_request_theme') {
              return emitEvent('theme_changed', { theme_params: themeParams });
            }
            if (e[0] === 'web_app_request_viewport') {
              return emitEvent('viewport_changed', {
                height: window.innerHeight,
                is_expanded: true,
                is_state_stable: true,
                width: window.innerWidth,
              });
            }
            if (e[0] === 'web_app_request_content_safe_area') {
              return emitEvent('content_safe_area_changed', noInsets);
            }
            if (e[0] === 'web_app_request_safe_area') {
              return emitEvent('safe_area_changed', noInsets);
            }
          },
        });
      }
    })();
  }, []);
}
