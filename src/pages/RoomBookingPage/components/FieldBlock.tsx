import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { ReactNode } from 'react';

type FieldBlockProps = {
  label: ReactNode;
  children: ReactNode;
  flex?: boolean;
  gap?: number;
};

export function FieldBlock({ label, children, flex = false, gap = 6 }: FieldBlockProps) {
  return (
    <div css={containerCss(flex, gap)}>
      {typeof label === 'string' ? (
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>
      ) : (
        label
      )}
      {children}
    </div>
  );
}

const containerCss = (flex: boolean, gap: number) => css`
  display: flex;
  flex-direction: column;
  gap: ${gap}px;
  ${flex ? 'flex: 1;' : ''}
`;
