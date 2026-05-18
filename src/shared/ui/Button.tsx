import { ComponentProps } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';
import { Icon, IconName } from './Icon';

const button = tv({
  slots: {
    base: 'flex-row items-center justify-center gap-2 rounded-xl  disabled:opacity-50 disabled:cursor-not-allowed',
    text: 'font-semibold',
    icon: 'size-5',
  },
  variants: {
    size: {
      sm: {
        base: 'h-9 px-3',
        text: 'text-sm',
        icon: 'size-4',
      },
      md: {
        base: 'h-12 px-5',
        text: 'text-base',
        icon: 'size-5',
      },
      lg: {
        base: 'h-14 px-6',
        text: 'text-lg',
        icon: 'size-6',
      },
    },
    rounded: {
      sm: {
        base: 'rounded-sm',
      },
      md: {
        base: 'rounded-md',
      },
      lg: {
        base: 'rounded-lg',
      },
      xl: {
        base: 'rounded-xl',
      },
      full: {
        base: 'rounded-full',
      },
    },
    variant: {
      primary: {
        base: 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20',
        text: 'text-white',
        icon: 'text-white',
      },
      secondary: {
        base: 'bg-white border border-slate-200 hover:bg-slate-50',
        text: 'text-slate-900',
        icon: 'text-slate-900',
      },
      destructive: {
        base: 'bg-red-600 hover:bg-red-700',
        text: 'text-white',
        icon: 'text-white',
      },
      ghost: {
        base: 'hover:bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-600',
      },
      danger_ghost: {
        base: 'hover:bg-red-50',
        text: 'text-red-600',
        icon: 'text-red-600',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

type ButtonProps = ComponentProps<typeof TouchableOpacity> &
  VariantProps<typeof button> & {
    isLoading?: boolean;
    iconName?: IconName;
  };

export const Button: React.FC<ButtonProps> = ({
  size,
  variant,
  rounded,
  children,
  iconName,
  className,
  isLoading = false,
  ...rest
}) => {
  const { base, text, icon } = button({ size, variant, rounded });

  return (
    <TouchableOpacity
      disabled={isLoading}
      activeOpacity={0.8}
      className={`${base()} ${className}`}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator size="small" className={text()} />
      ) : (
        <>
          {iconName && <Icon name={iconName} className={icon()} />}
          {children && <Text className={text()}>{children}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};
