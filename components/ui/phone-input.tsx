'use client';

import * as React from 'react';
import PhoneInputPrimitive from 'react-phone-number-input';
import type { Country, Value } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { getCountryCallingCode } from 'react-phone-number-input';
import { Check, ChevronsUpDown, Globe, Loader2 } from 'lucide-react';

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
  options?: CountrySelectOption[];
  disabled?: boolean;
  labels?: Record<string, string>;
};

const InputField = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex-1 bg-transparent text-base font-medium text-white placeholder:text-slate-400 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
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
  const [loading, setLoading] = React.useState(false);
  const loadingTimeout = React.useRef<number>();

  const labelFor = React.useCallback(
    (option: CountrySelectOption) => labels?.[option.value] ?? option.label,
    [labels],
  );

  const enhancedOptions = React.useMemo(
    () =>
      (options ?? []).map((option) => ({
        ...option,
        icon: option.icon ?? flags[option.value as Country],
      })),
    [options],
  );

  const selected = React.useMemo(
    () => enhancedOptions.find((option) => option.value === value),
    [enhancedOptions, value],
  );

  const selectedLabel = selected ? labelFor(selected) : 'Select country';
  const selectedCode = React.useMemo(() => getCallingCode(selected?.value), [selected?.value]);
  const SelectedIcon = selected?.icon;

  const handleSelect = (country?: string) => {
    setLoading(true);
    onChange(country);
    setOpen(false);

    if (loadingTimeout.current) {
      window.clearTimeout(loadingTimeout.current);
    }

    loadingTimeout.current = window.setTimeout(() => {
      setLoading(false);
    }, 250);
  };

  React.useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        window.clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'flex h-10 min-w-[132px] items-center justify-between gap-2 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-slate-950/90 via-slate-900/95 to-slate-950/90 px-3 text-sm text-white shadow-[0_0_18px_rgba(16,185,129,0.1)] transition-all duration-200',
              'hover:border-emerald-400/60 hover:shadow-[0_0_22px_rgba(16,185,129,0.25)] focus-visible:ring-0 focus-visible:ring-offset-0',
              disabled && 'cursor-not-allowed opacity-60',
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 truncate">
              {SelectedIcon ? (
                <span className="transition-transform duration-300 hover:scale-110">
                  <SelectedIcon key={selected?.value} title={selectedLabel} />
                </span>
              ) : (
                <Globe className="h-4 w-4 text-emerald-300/80" />
              )}
              <span className="max-w-[76px] truncate text-xs font-medium uppercase tracking-wide text-slate-100">
                {selectedLabel}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {selectedCode && <span className="text-xs text-emerald-300/90">+{selectedCode}</span>}
              <ChevronsUpDown className="h-4 w-4 text-slate-300" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          avoidCollisions={false}
          className="w-[280px] border border-slate-700/70 bg-slate-950/95 p-0 text-white shadow-xl"
        >
          <Command className="w-full">
            <div className="border-b border-slate-800 bg-slate-950/80 p-2">
              <CommandInput
                placeholder="Search country..."
                className="h-9 rounded-md border border-slate-700 bg-slate-900/80 px-3 text-sm text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-400/40"
              />
            </div>
            <CommandList className="max-h-64 overflow-y-auto overscroll-contain scroll-smooth">
              <CommandEmpty className="py-4 text-center text-sm text-slate-400">
                No country found.
              </CommandEmpty>
              <CommandGroup className="space-y-1 px-1 py-1">
                {enhancedOptions.map((option) => {
                  const Icon = option.icon;
                  const label = labelFor(option);
                  const code = getCallingCode(option.value);
                  const isActive = option.value === value;

                  return (
                    <CommandItem
                      key={option.value}
                      value={label}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                        'hover:bg-slate-900/80 hover:text-white data-[selected=true]:bg-emerald-500/20 data-[selected=true]:text-emerald-200',
                        isActive && 'bg-emerald-500/20 text-emerald-200',
                      )}
                    >
                      {Icon ? <Icon title={label} /> : <Globe className="h-4 w-4 text-emerald-300/80" />}
                      <span className="flex-1 truncate text-left text-sm font-medium text-slate-100">
                        {label}
                      </span>
                      {code && <span className="text-xs text-emerald-200/80">+{code}</span>}
                      {isActive && <Check className="h-4 w-4 text-emerald-300" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-200/80">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
    </div>
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
        'flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all',
        'focus-within:border-emerald-400 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.35)]',
        className,
      )}
      {...rest}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';

export type { Value as PhoneNumberValue };
