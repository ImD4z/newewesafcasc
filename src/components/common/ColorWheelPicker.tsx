import React from 'react';

interface ColorWheelPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({ colors, selectedColor, onColorSelect }) => {
  const wheelSize = 180; // size in px
  const radius = wheelSize / 2 - 20; // radius of the circle of colors
  const buttonSize = 32;

  const angleStep = 360 / colors.length;

  return (
    <div className="relative flex items-center justify-center" style={{ width: wheelSize, height: wheelSize }}>
      {colors.map((color, i) => {
        const angle = i * angleStep;
        const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
        const y = radius * Math.sin((angle - 90) * (Math.PI / 180));

        return (
          <button
            type="button"
            key={color}
            onClick={() => onColorSelect(color)}
            className={`absolute rounded-full transition-transform transform hover:scale-110 border-2 ${selectedColor === color ? 'border-white scale-110' : 'border-transparent'}`}
            style={{
              backgroundColor: color,
              width: buttonSize,
              height: buttonSize,
              top: `calc(50% + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              marginLeft: -buttonSize / 2,
              marginTop: -buttonSize / 2,
            }}
          />
        );
      })}
      <div
        className="absolute w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />
    </div>
  );
};

export default ColorWheelPicker;