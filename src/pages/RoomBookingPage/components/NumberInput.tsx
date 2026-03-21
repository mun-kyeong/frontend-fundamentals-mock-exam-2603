import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

type NumberInputProps = {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  ariaLabel: string;
  inputCss?: SerializedStyles;
};

export function NumberInput({
  value,
  min,
  max,
  disabled,
  onChange,
  ariaLabel,
  inputCss,
}: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      onChange={e => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      css={[inputCssBase, inputCss]}
    />
  );
}

const inputCssBase = css`
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  height: 48px;
  background-color: ${colors.grey50};
  border-radius: 12px;
  color: ${colors.grey800};
  width: 100%;
  border: 1px solid ${colors.grey200};
  padding: 0 16px;
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${colors.blue500};
  }
`;
