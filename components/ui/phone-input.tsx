'use client';

import * as React from 'react';

import { Check, ChevronsUpDown, Globe, Loader2 } from 'lucide-react';
import PhoneInputPrimitive, {
  getCountryCallingCode,
} from 'react-phone-number-input';
import type { Country, Value } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────
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

// ─── Country Data ────────────────────────────────────────────────────────
const allCountries: CountrySelectOption[] = (Object.keys(flags) as Country[])
  .filter(code => !!flags[code])
  .map(code => ({
    value: code,
    label: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code,
    icon: flags[code]!,
  }));

// ─── Input Field ─────────────────────────────────────────────────────────
const InputField = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex-1 bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
      className
    )}
    {...props}
  />
));
InputField.displayName = 'PhoneInputField';

const getCodeSafe = (country?: string) => {
  if (!country) return '';
  try {
    return getCountryCallingCode(country as Country);
  } catch {
    return '';
  }
};

// ─── Country Select ──────────────────────────────────────────────────────
const CountrySelect = ({
  value,
  onChange,
  options,
  disabled,
  labels,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const selected = options.find(option => option.value === value);
  const selectedLabel = selected
    ? (labels?.[selected.value] ?? selected.label)
    : 'Select Country';
  const selectedCode = getCodeSafe(selected?.value);
  const SelectedIcon = selected?.icon;

  const handleSelect = (country?: string) => {
    setLoading(true);
    setTimeout(() => {
      onChange(country);
      setLoading(false);
      setOpen(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'flex h-10 min-w-[120px] items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/60 px-2.5 text-sm text-foreground transition-all duration-200 backdrop-blur-sm dark:border-white/20 dark:bg-slate-900/60',
              'hover:border-primary/60 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="flex items-center gap-2">
              {SelectedIcon ? (
                <span className="transition-transform duration-300 hover:scale-110">
                  <SelectedIcon key={selected?.value} title={selectedLabel} />
                </span>
              ) : (
                <Globe className="h-4 w-4 text-primary" />
              )}
              <span className="max-w-[60px] truncate text-xs uppercase tracking-wide">
                {selectedLabel}
              </span>
            </div>
            {selectedCode && (
              <span className="whitespace-nowrap text-xs text-primary">
                +{selectedCode}
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          avoidCollisions={false}
          className="w-[260px] overflow-hidden rounded-xl border border-border/60 bg-background/95 text-foreground shadow-xl backdrop-blur-lg dark:border-white/20"
        >
          <Command className="w-full">
            <div className="border-b border-border/60 p-2">
              <CommandInput
                placeholder="Search country..."
                className="rounded-md border border-border/60 bg-transparent px-3 py-1.5 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* FIXED: Allow scrolling anywhere inside the list */}
            <div className="pointer-events-auto max-h-[240px] overflow-auto scroll-smooth px-1 py-1">
              <CommandList className="overflow-visible">
                <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                  No country found.
                </CommandEmpty>
                <CommandGroup>
                  {options.map(option => {
                    const Icon = option.icon;
                    const code = getCodeSafe(option.value);
                    const isActive = option.value === value;

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          'flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 px-3 text-sm transition-colors',
                          'hover:bg-primary/10 hover:text-foreground',
                          isActive && 'bg-primary/20 text-foreground'
                        )}
                      >
                        {Icon ? (
                          <Icon title={option.label} />
                        ) : (
                          <Globe className="h-4 w-4 text-primary" />
                        )}
                        <span className="flex-1 truncate">{option.label}</span>
                        {code && (
                          <span className="text-xs text-primary">+{code}</span>
                        )}
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {loading && (
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};
CountrySelect.displayName = 'PhoneCountrySelect';

// ─── Main Phone Input ────────────────────────────────────────────────────
export const PhoneInput = React.forwardRef<PhoneInputElement, PhoneInputProps>(
  (
    {
      className,
      inputComponent,
      smartCaret = false,
      international = true,
      withCountryCallingCode = true,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    return (
      <PhoneInputPrimitive
        ref={ref}
        flags={flags}
        international={international}
        withCountryCallingCode={withCountryCallingCode}
        smartCaret={smartCaret}
        countrySelectComponent={props => (
          <CountrySelect {...props} options={allCountries} />
        )}
        inputComponent={inputComponent ?? InputField}
        value={value}
        onChange={onChange}
        className={cn(
          'flex h-11 w-full items-center gap-3 rounded-2xl border border-border/60 bg-white/60 px-3 text-base text-foreground shadow-sm transition-all backdrop-blur-sm focus-within:border-primary/70 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.25)] dark:border-white/20 dark:bg-slate-900/60',
          className
        )}
        {...rest}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

export type { Value as PhoneNumberValue };
