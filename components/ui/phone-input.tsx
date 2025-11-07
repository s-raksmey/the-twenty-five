'use client'

import * as React from 'react'
import PhoneInputPrimitive from 'react-phone-number-input'
import type { Country, Value } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { getCountryCallingCode } from 'react-phone-number-input'
import { Check, ChevronsUpDown, Globe, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────
type PhoneInputElement = React.ComponentRef<typeof PhoneInputPrimitive>
type PhoneInputProps = React.ComponentProps<typeof PhoneInputPrimitive> & {
  className?: string
}

type CountrySelectOption = {
  value: string
  label: string
  icon?: React.ComponentType<{ title: string }>
}

type CountrySelectProps = {
  value?: string
  onChange: (value?: string) => void
  options: CountrySelectOption[]
  disabled?: boolean
  labels?: Record<string, string>
}

// ─── Country Data ────────────────────────────────────────────────────────
const allCountries: CountrySelectOption[] = (Object.keys(flags) as Country[])
  .filter((code) => !!flags[code])
  .map((code) => ({
    value: code,
    label: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code,
    icon: flags[code]!,
  }))

// ─── Input Field ─────────────────────────────────────────────────────────
const InputField = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex-1 bg-transparent text-base font-medium text-white placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
)
InputField.displayName = 'PhoneInputField'

const getCodeSafe = (country?: string) => {
  if (!country) return ''
  try {
    return getCountryCallingCode(country as Country)
  } catch {
    return ''
  }
}

// ─── Country Select ──────────────────────────────────────────────────────
const CountrySelect = ({ value, onChange, options, disabled, labels }: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const selected = options.find((option) => option.value === value)
  const selectedLabel = selected
    ? labels?.[selected.value] ?? selected.label
    : 'Select Country'
  const selectedCode = getCodeSafe(selected?.value)
  const SelectedIcon = selected?.icon

  const handleSelect = (country?: string) => {
    setLoading(true)
    setTimeout(() => {
      onChange(country)
      setLoading(false)
      setOpen(false)
    }, 500)
  }

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'flex h-10 min-w-[120px] items-center justify-between gap-2 rounded-lg border border-primary/40 bg-slate-900/70 px-2.5 text-sm text-white transition-all duration-200',
              'hover:bg-slate-800 hover:border-primary/60 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <div className="flex items-center gap-2">
              {SelectedIcon ? (
                <span className="transition-transform duration-300 hover:scale-110">
                  <SelectedIcon key={selected?.value} title={selectedLabel} />
                </span>
              ) : (
                <Globe className="h-4 w-4 text-primary/70" />
              )}
              <span className="text-xs uppercase tracking-wide text-slate-100 truncate max-w-[60px]">
                {selectedLabel}
              </span>
            </div>
            {selectedCode && (
              <span className="text-xs text-primary/80 whitespace-nowrap">+{selectedCode}</span>
            )}
            <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          avoidCollisions={false}
          className="w-[260px] border border-slate-700 bg-slate-900 text-white rounded-md shadow-xl overflow-hidden"
        >
          <Command className="w-full">
            <div className="p-2 border-b border-slate-700">
              <CommandInput
                placeholder="Search country..."
                className="text-sm text-white border border-slate-700 rounded-md px-3 py-1.5 bg-slate-800 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* FIXED: Allow scrolling anywhere inside the list */}
            <div className="max-h-[240px] overflow-auto scroll-smooth touch-pan-y px-1 py-1 pointer-events-auto">
              <CommandList className="overflow-visible">
                <CommandEmpty className="py-4 text-center text-sm text-slate-400">
                  No country found.
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const Icon = option.icon
                    const code = getCodeSafe(option.value)
                    const isActive = option.value === value

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          'flex items-center gap-2 py-1.5 px-3 rounded-md text-sm cursor-pointer transition-colors select-none',
                          'hover:bg-slate-800 hover:text-white',
                          isActive && 'bg-primary/25 text-primary',
                        )}
                      >
                        {Icon ? (
                          <Icon title={option.label} />
                        ) : (
                          <Globe className="h-4 w-4 text-primary/70" />
                        )}
                        <span className="flex-1 truncate">{option.label}</span>
                        {code && <span className="text-xs text-primary/70">+{code}</span>}
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-primary/80 text-xs mt-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  )
}
CountrySelect.displayName = 'PhoneCountrySelect'

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
    ref,
  ) => {
    return (
      <PhoneInputPrimitive
        ref={ref}
        flags={flags}
        international={international}
        withCountryCallingCode={withCountryCallingCode}
        smartCaret={smartCaret}
        countrySelectComponent={(props) => (
          <CountrySelect {...props} options={allCountries} />
        )}
        inputComponent={inputComponent ?? InputField}
        value={value}
        onChange={onChange}
        className={cn(
          'flex h-11 w-full items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-3 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all',
          'focus-within:border-primary focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.4)]',
          className,
        )}
        {...rest}
      />
    )
  },
)
PhoneInput.displayName = 'PhoneInput'

export type { Value as PhoneNumberValue }
