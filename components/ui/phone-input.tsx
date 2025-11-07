'use client';

import * as React from 'react';
import PhoneInputPrimitive from 'react-phone-number-input';
import type { Country, Value } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { getCountryCallingCode } from 'react-phone-number-input';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PhoneInputElement = React.ComponentRef<typeof PhoneInputPrimitive>;
type PhoneInputProps = React.ComponentProps<typeof PhoneInputPrimitive> & {
  className?: string;
};

type CountrySelectOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ title: string }>;
};

type CountrySelectProps = {
  value?: string;
  onChange: (value?: string) => void;
  options: CountrySelectOption[];
  disabled?: boolean;
  labels?: Record<string, string>;
};

const InputField = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex-1 bg-transparent text-base font-medium text-white placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
InputField.displayName = 'PhoneInputField';

const getCallingCode = (country?: string) => {
  if (!country) return '';
  try {
    return getCountryCallingCode(country as Country);
  } catch {
    return '';
  }
};

const CountrySelect = ({ value, onChange, options, disabled, labels }: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const labelFor = React.useCallback(
    (option: CountrySelectOption) => labels?.[option.value] ?? option.label,
    [labels],
  );

  const selectedCode = React.useMemo(() => getCallingCode(selected?.value), [selected?.value]);
  const selectedLabel = selected ? labelFor(selected) : 'Select country';

  const handleSelect = (country?: string) => {
    onChange(country);
    setOpen(false);
  };

  const SelectedIcon = selected?.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        >
          {SelectedIcon ? <SelectedIcon title={selectedLabel} /> : <Globe className="h-4 w-4" />}
          <span className="text-xs uppercase tracking-wide text-slate-200/80">{selectedLabel}</span>
          {selectedCode && <span className="text-xs text-emerald-300">+{selectedCode}</span>}
          <ChevronsUpDown className="h-4 w-4 text-slate-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 border border-white/10 bg-slate-900/95 p-0 text-white">
        <Command>
          <CommandInput placeholder="Search country" className="border-0 focus-visible:ring-0" />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-slate-400">No country found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {options.map((option) => {
                const Icon = option.icon;
                const label = labelFor(option);
                const code = getCallingCode(option.value);
                const isActive = option.value === value;

                return (
                  <CommandItem
                    key={option.value}
                    value={label}
                    className="flex items-center gap-3 py-2 text-sm"
                    onSelect={() => handleSelect(option.value)}
                  >
                    {Icon ? <Icon title={label} /> : <Globe className="h-4 w-4" />}
                    <span className="flex-1 text-left text-sm">{label}</span>
                    {code && <span className="text-xs text-slate-400">+{code}</span>}
                    {isActive && <Check className="h-4 w-4 text-emerald-300" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountrySelect.displayName = 'PhoneCountrySelect';

export const PhoneInput = React.forwardRef<PhoneInputElement, PhoneInputProps>((props, ref) => {
  const {
    className,
    inputComponent,
    countrySelectComponent,
    smartCaret,
    international,
    withCountryCallingCode,
    value,
    onChange,
    ...rest
  } = props;

  const resolvedSmartCaret = smartCaret ?? false;
  const resolvedInternational = international ?? true;
  const resolvedWithCountryCallingCode = withCountryCallingCode ?? true;

  return (
    <PhoneInputPrimitive
      ref={ref}
      flags={flags}
      international={resolvedInternational}
      withCountryCallingCode={resolvedWithCountryCallingCode}
      smartCaret={resolvedSmartCaret}
      countrySelectComponent={countrySelectComponent ?? CountrySelect}
      inputComponent={inputComponent ?? InputField}
      value={value}
      onChange={onChange}
      className={cn(
        'flex h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-within:border-emerald-400 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.25)]',
        className,
      )}
      {...rest}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';

export type { Value as PhoneNumberValue };
