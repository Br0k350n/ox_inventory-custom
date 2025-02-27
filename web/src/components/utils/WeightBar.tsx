import React, { useMemo } from 'react';

// Manually darken the color by subtracting a fixed value
const darkenColorManually = (rgb: number[], factor: number) => {
  return rgb.map((value) => Math.max(value - factor, 0)); // Ensure value doesn't go below 0
};

const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  primaryColor: [128, 0, 128], // Purple
  secondColor: [148, 0, 211], // Dark Violet
  accentColor: [186, 85, 211], // Medium Orchid (Light Purple)
};

// Manually darkened colors for borders (shades of purple)
const DARKENED_COLORS = {
  primaryColorBorder: darkenColorManually([128, 0, 128], 50), // Darker purple
  secondColorBorder: darkenColorManually([148, 0, 211], 50), // Darker dark violet
  accentColorBorder: darkenColorManually([186, 85, 211], 50), // Darker medium orchid
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const color = useMemo(
    () =>
      durability
        ? percent < 50
          ? colorMixer(COLORS.accentColor, COLORS.primaryColor, percent / 100)
          : colorMixer(COLORS.secondColor, COLORS.accentColor, percent / 100)
        : percent > 50
        ? colorMixer(COLORS.primaryColor, COLORS.accentColor, percent / 100)
        : colorMixer(COLORS.accentColor, COLORS.secondColor, percent / 50),
    [durability, percent]
  );

  // Only used for the weight bar (boxes)
  const numBoxes = 10;
  const fullBoxes = Math.floor((percent / 100) * numBoxes);
  const remainingPercent = (percent / 100) * numBoxes - fullBoxes;

  return (
    <div
      className={durability ? 'durability-bar' : 'weight-bar'}
      style={{
        display: 'flex',
        width: durability ? '100%' : '25%',
        height: durability ? 'auto' : '1vh',
        borderRadius: '5px',
        padding: durability ? '0' : '2px',
      }}
    >
      {durability ? (
        // Durability bar: single solid bar
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'background 0.3s ease',
            borderRadius: '5px',
          }}
        />
      ) : (
        // Weight bar: boxes only
        <>
          {/* Fully filled boxes */}
          {Array.from({ length: fullBoxes }).map((_, index) => (
            <div
              key={index}
              className="weight-bar-box filled"
              style={{
                backgroundColor: color, // Fully filled boxes
                marginRight: '2%',
                width: '8%',
                height: '100%',
                borderRadius: '2px',
                border: `1px solid rgb(${DARKENED_COLORS.primaryColorBorder.join(', ')})`, // Manually set darker border color for filled boxes
                opacity: 1, // Fully opaque for filled boxes
              }}
            />
          ))}

          {/* Partial box for the remaining fraction */}
          {remainingPercent > 0 && (
            <div
              className="weight-bar-box partial"
              style={{
                // Smooth gradient background for the partial box
                background: `linear-gradient(to right, ${color} ${remainingPercent * 100}%, rgba(0, 0, 0, 0) 0%)`,
                marginRight: '2%',
                width: '8%',
                height: '100%',
                borderRadius: '2px',
                border: `1px solid rgb(${DARKENED_COLORS.primaryColorBorder.join(', ')})`, // Manually set darker border color for partial box
                opacity: 0.5, // Partially opaque for the partial box
              }}
            />
          )}

          {/* Empty boxes */}
          {Array.from({ length: numBoxes - fullBoxes - (remainingPercent > 0 ? 1 : 0) }).map((_, index) => (
            <div
              key={fullBoxes + index}
              className="weight-bar-box empty"
              style={{
                backgroundColor: 'transparent',
                marginRight: '2%',
                width: '8%',
                height: '100%',
                borderRadius: '2px',
                border: `1px solid rgba(0, 0, 0, 0.3)`, // Manually set darker border for empty boxes
                opacity: 1 - Math.pow(index / numBoxes, 2), // Faster fading effect for empty boxes
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default WeightBar;
