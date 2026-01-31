import type { HTMLProps } from 'react';

import { Portal } from '@ark-ui/react/portal';
import { ListCollection, Select } from '@ark-ui/react/select';
import { Noop } from '@util/types';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

interface SelectMenuProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  collection: ListCollection;
  isLoading?: boolean;
  onChange?: (value?: string) => ReturnType<Noop>;
  portaled?: boolean;
  value?: string;
}

export const SelectMenu = ({
  className,
  collection,
  disabled,
  isLoading,
  onChange,
  portaled,
  value,
}: SelectMenuProps) => {
  return (
    <Select.Root
      className={clsx(className, 'flex')}
      collection={collection}
      disabled={isLoading || disabled}
      lazyMount
      onValueChange={async ({ value: v }) => {
        const selected = v[0];
        await onChange?.(selected);
      }}
      positioning={{ sameWidth: true }}
      unmountOnExit
      value={value ? [value] : undefined}
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
                className="list-row hover:cursor-pointer hover:bg-secondary rounded-none"
                item={item}
                key={idx}
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
