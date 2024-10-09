import { CSSProperties, FC, SVGProps } from "react";
import Icon from "@ant-design/icons";

// Import SVGs as URLs
const svgImports = import.meta.glob("./svgs/audio/*.svg", { eager: true });

interface IconFontProps {
  className?: string;
  style?: CSSProperties;
  level?: number;
}

// Create a mapping of level to SVG URL
const audioPlayingStepMap: Record<number, string> = Object.fromEntries(
  Object.entries(svgImports).map(([path, module]) => {
    const level = parseInt(path.match(/level(\d+)\.svg$/)?.[1] || "0");
    return [level, (module as { default: string }).default];
  })
);

export const AudoiAnimationIcon: FC<IconFontProps> = ({
  className,
  style,
  level = 1,
}) => {
  const sStyle: CSSProperties = {
    pointerEvents: "none",
    ...style,
  };

  const svgUrl = audioPlayingStepMap[level] || audioPlayingStepMap[1];

  return (
    <Icon
      className={className}
      component={() => <img src={svgUrl} alt={`Audio level ${level}`} />}
      style={sStyle}
    />
  );
};
