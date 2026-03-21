import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type MessageBannerProps = {
  type: 'success' | 'error';
  text: string;
};

export function MessageBanner({ type, text }: MessageBannerProps) {
  return (
    <div
      css={[
        messageBaseCss,
        type === 'success' ? messageSuccessCss : messageErrorCss,
      ]}
    >
      <Text
        typography="t7"
        fontWeight="medium"
        color={type === 'success' ? colors.blue600 : colors.red500}
      >
        {text}
      </Text>
    </div>
  );
}

const messageBaseCss = css`
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const messageSuccessCss = css`
  background: ${colors.blue50};
`;

const messageErrorCss = css`
  background: ${colors.red50};
`;
