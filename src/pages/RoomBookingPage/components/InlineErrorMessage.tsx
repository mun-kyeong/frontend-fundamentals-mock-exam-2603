import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type InlineErrorMessageProps = {
  message: string;
  inset?: number;
  topSpacing?: number;
};

export function InlineErrorMessage({ message, inset = 24, topSpacing = 12 }: InlineErrorMessageProps) {
  return (
    <div css={containerCss(inset)}>
      {topSpacing > 0 && <Spacing size={topSpacing} />}
      <div css={bannerCss} role="alert">
        <Text typography="t7" fontWeight="medium" color={colors.red500}>
          {message}
        </Text>
      </div>
    </div>
  );
}

const containerCss = (inset: number) => css`
  padding: 0 ${inset}px;
`;

const bannerCss = css`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${colors.red50};
  display: flex;
  align-items: center;
  gap: 8px;
`;
