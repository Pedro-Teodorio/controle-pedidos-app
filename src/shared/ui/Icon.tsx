import { ComponentType } from 'react';
import { LucideProps } from 'lucide-react-native';
import * as AllIcons from 'lucide-react-native/icons';
import { cssInterop } from 'nativewind';

export type IconName = keyof typeof AllIcons;

export interface IconProps {
  name: keyof typeof AllIcons;
  className?: string;
}

const iconMap = AllIcons as Record<string, ComponentType<LucideProps>>;

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const LucideIcon = iconMap[name as string];

  if (!LucideIcon) {
    return null;
  }

  cssInterop(LucideIcon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        width: true,
        height: true,
        stroke: true,
        fill: true,
      },
    },
  });

  return <LucideIcon className={className} />;
};
