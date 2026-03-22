import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

type ValidationMessageProps = {
  message: string;
};

export function ValidationMessage({ message }: ValidationMessageProps) {
  return (
    <span css={validationTextCss} role="alert">
      {message}
    </span>
  );
}

const validationTextCss = css`
  color: ${colors.red500};
  font-size: 14px;
`;

