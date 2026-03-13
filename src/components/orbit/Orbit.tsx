//Interface imports
import type OrbitInterface from '../../interfaces/orbit';

import styles from './Orbit.module.css';
export function Orbit(config: OrbitInterface) {
  const { name, rx, ry, rotation, fill, duration, stroke, strokeWidth, image } = config;
  const padding = 50;

  // Path centered at (0,0)
  const path = `M ${rx} 0 A ${rx} ${ry} ${rotation} 1 1 ${-rx} 0 A ${rx} ${ry} ${rotation} 1 1 ${rx} 0 Z`;

  return (
    <div className={styles.container}>
      <svg
        name={name}
        width={rx * 2 + padding * 2}
        height={ry * 2 + padding * 2}
        viewBox={[-rx - padding, -ry - padding,rx * 2 + padding * 2, ry * 2 + padding * 2].join(" ")}
      >
        <path
          d={path}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <image  href={image.path}
                width={image.defaultWidth}
                height={image.defaultWidth}
                x={image.defaultWidth ? image.defaultWidth / 2 * -1 : -20}
                y={image.defaultWidth ? image.defaultWidth / 2 * -1 : -20}
            >
            <animateMotion
                dur={duration}
                repeatCount="indefinite"
                path={path}
            />
        </image>
      </svg>
    </div>
  );
}
