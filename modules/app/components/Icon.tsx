import React from 'react';
import {icons} from './icons';
export default function Icon({
  name,
  size = 15,
  color = 'currentColor',
  role = 'presentation',

  ...rest
}: {
  name: string;
  size?: number;
  color?: string;
  role?: string;
}): React.ReactElement | null {
  if (!icons[name]) {
    console.error(`No icon found with name ${name}`);
    return null;
  }

  return (
    <svg
      style={{
        width: size,
        height: size,
        verticalAlign: 'middle'
      }}
      viewBox={icons[name].viewBox || '0 0 24 24'}
      color={color}
      display="inline-block"
      role={role}
      {...rest}
    >
      {icons[name].path}
    </svg>
  );
}
