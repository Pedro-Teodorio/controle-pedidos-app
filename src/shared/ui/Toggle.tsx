import { ComponentProps } from 'react';
import { cssInterop } from 'nativewind';
import { Switch } from 'react-native';
import { tv } from 'tailwind-variants';

const StyledSwitch = cssInterop(Switch, {
  className: 'style',
  thumbClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: 'thumbColor',
    },
  },
  trackClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: 'trackColor.false',
    },
  },
  activeTrackClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: 'trackColor.true',
    },
  },
  iosBackgroundClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: 'ios_backgroundColor',
    },
  },
});

const toggle = tv({
  slots: {
    thumb: 'bg-white',
    track: 'bg-slate-300',
    activeTrack: 'bg-blue-600',
    iosBackground: 'bg-slate-300',
  },
  variants: {
    disabled: {
      true: {
        thumb: 'bg-slate-100',
        track: 'bg-slate-200',
        activeTrack: 'bg-slate-300',
        iosBackground: 'bg-slate-200',
      },
    },
  },
});

type ToggleProps = Omit<
  ComponentProps<typeof Switch>,
  'thumbColor' | 'trackColor' | 'ios_backgroundColor'
>;

export const Toggle: React.FC<ToggleProps> = ({ disabled, ...props }) => {
  const styles = toggle({ disabled });

  return (
    <StyledSwitch
      thumbClassName={styles.thumb()}
      trackClassName={styles.track()}
      activeTrackClassName={styles.activeTrack()}
      iosBackgroundClassName={styles.iosBackground()}
      disabled={disabled}
      {...props}
    />
  );
};
