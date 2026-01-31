import { maskitoPrefixPostprocessorGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';

import type { MaskitoOptions, MaskitoPreprocessor } from '@maskito/core';

const TG_USERNAME_RE =
  /^(?:https?:\/\/)?(?:t(?:elegram)?\.me\/)?@?([a-z0-9_]{1,32})(?:[/?].*)?$/i;

const normalizeInput: MaskitoPreprocessor = ({ elementState, data }) => {
  if (typeof data !== 'string') return { elementState, data };

  const trimmed = data.trim();
  const m = trimmed.match(TG_USERNAME_RE);
  if (m) {
    return { elementState, data: m[1].toLowerCase() };
  }

  const cleaned = trimmed.toLowerCase().replace(/[^a-z0-9_]/g, '');
  return { elementState, data: cleaned };
};

const options: MaskitoOptions = {
  mask: /^[a-z0-9_]{0,32}$/,
  preprocessors: [normalizeInput],
  postprocessors: [maskitoPrefixPostprocessorGenerator('@')],
};
export const useTgLinkMask = () => useMaskito({ options });
