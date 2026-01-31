import type { MaskitoOptions, MaskitoPreprocessor } from '@maskito/core';

import { maskitoPrefixPostprocessorGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

const TG_USERNAME_RE =
  /^(?:https?:\/\/)?(?:t(?:elegram)?\.me\/)?@?([a-z0-9_]{1,32})(?:[/?].*)?$/i;

const normalizeInput: MaskitoPreprocessor = ({ data, elementState }) => {
  if (typeof data !== 'string') return { data, elementState };

  const trimmed = data.trim();
  const m = trimmed.match(TG_USERNAME_RE);
  if (m) {
    return { data: m[1].toLowerCase(), elementState };
  }

  const cleaned = trimmed.toLowerCase().replace(/[^a-z0-9_]/g, '');
  return { data: cleaned, elementState };
};

const options: MaskitoOptions = {
  mask: /^[a-z0-9_]{0,32}$/,
  postprocessors: [maskitoPrefixPostprocessorGenerator('@')],
  preprocessors: [normalizeInput],
};
export const useTgLinkMask = () => useMaskito({ options });
