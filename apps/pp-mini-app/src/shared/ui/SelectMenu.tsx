import { Portal } from '@ark-ui/react/portal';
import { ListCollection, Select } from '@ark-ui/react/select';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

import type { HTMLProps } from 'react';

import { Noop } from '../types';

interface SelectMenuProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  value?: string;
  portaled?: boolean;
  onChange?: (value?: string) => ReturnType<Noop>;
  isLoading?: boolean;
  collection: ListCollection;
}

export const SelectMenu = ({
  value,
  onChange,
  isLoading,
  disabled,
  portaled,
  className,
  collection,
}: SelectMenuProps) => {
  return (
    <Select.Root
      positioning={{ sameWidth: true }}
      className={clsx(className, 'flex')}
      lazyMount
      unmountOnExit
      collection={collection}
      disabled={isLoading || disabled}
      value={value ? [value] : undefined}
      onValueChange={async ({ value: v }) => {
        const selected = v[0];
        await onChange?.(selected);
      }}
    >
      <Select.Trigger className="input flex-grow select-none">
        <Select.ValueText className="flex-grow text-left select-none" />
        <Select.Indicator className="flex data-[state=open]:rotate-180">
          <ChevronDown className="size-3" />
        </Select.Indicator>
      </Select.Trigger>
      <Portal disabled={!portaled}>
        <Select.Positioner className="!h-min !z-1000">
          <Select.Content className="list bg-base-100 rounded-box shadow-md overflow-hidden">
            {collection.items.map((item, idx) => (
              <Select.Item
                key={idx}
                item={item}
                className="list-row hover:cursor-pointer hover:bg-secondary rounded-none"
              >
                <Select.ItemText>
                  {collection.stringifyItem(item)}
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="size-3" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
