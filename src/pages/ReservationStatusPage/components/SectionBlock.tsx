import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { ReactNode } from 'react';

type SectionBlockProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
};

export function SectionBlock({ title, subtitle, children }: SectionBlockProps) {
  return (
    <div>
      <div css={titleRowCss}>
        {typeof title === 'string' ? (
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            {title}
          </Text>
        ) : (
          title
        )}
        {subtitle !== undefined &&
          (typeof subtitle === 'string' ? (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {subtitle}
            </Text>
          ) : (
            subtitle
          ))}
      </div>
      {children}
    </div>
  );
}

const titleRowCss = css`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
