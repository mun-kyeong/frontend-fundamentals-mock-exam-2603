import { Select, Spacing } from '_tosslib/components';
import { css } from '@emotion/react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '../../../shared/components/DatePicker';
import { TIME_SLOTS } from '../constants';
import { FieldBlock } from './FieldBlock';
import { NumberInput } from './NumberInput';
import { ToggleChipButton } from './ToggleChipButton';
import type { Equipment } from '_tosslib/server/types';
import type { FormValues } from '../hooks/useRoomBookingForm';
import { formatDate } from '../../../shared/utils/date.utils';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from '../../../shared/constants/equipment.constants';

type Props = {
  floors: number[];
  equipment: Equipment[];
  onFilterChange: () => void;
};

export function ReservationConditionsSection(props: Props) {
  const { floors, equipment, onFilterChange } = props;
  const { control, setValue, trigger } = useFormContext<FormValues>();

  return (
    <>
      <Spacing size={16} />

      {/* 날짜 */}
      <FieldBlock label="날짜">
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              min={formatDate(new Date())}
              onChange={value => {
                field.onChange(value);
                onFilterChange();
              }}
              ariaLabel="날짜"
            />
          )}
        />
      </FieldBlock>
      <Spacing size={14} />

      {/* 시간 */}
      <div css={twoColumnRowCss}>
        <FieldBlock label="시작 시간" flex>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value);
                  trigger(['startTime', 'endTime']);
                  onFilterChange();
                }}
                aria-label="시작 시간"
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          />
        </FieldBlock>
        <FieldBlock label="종료 시간" flex>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value);
                  trigger(['startTime', 'endTime']);
                  onFilterChange();
                }}
                aria-label="종료 시간"
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          />
        </FieldBlock>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div css={twoColumnRowCss}>
        <FieldBlock label="참석 인원" flex>
          <Controller
            control={control}
            name="attendees"
            render={({ field }) => (
              <NumberInput
                value={field.value}
                min={1}
                onChange={value => {
                  const nextValue = Math.max(1, value);
                  field.onChange(nextValue);
                  onFilterChange();
                }}
                ariaLabel="참석 인원"
              />
            )}
          />
        </FieldBlock>
        <FieldBlock label="선호 층" flex>
          <Controller
            control={control}
            name="preferredFloor"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value);
                  onFilterChange();
                }}
                aria-label="선호 층"
              >
                <option value="">전체</option>
                {floors.map(f => (
                  <option key={f} value={String(f)}>
                    {f}층
                  </option>
                ))}
              </Select>
            )}
          />
        </FieldBlock>
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <FieldBlock label="필요 장비">
        <Spacing size={8} />
        <div css={equipmentRowCss}>
          {ALL_EQUIPMENT.map(eq => {
            const selected = equipment.includes(eq);
            return (
              <ToggleChipButton
                key={eq}
                selected={selected}
                ariaLabel={EQUIPMENT_LABELS[eq]}
                onClick={() => {
                  const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  setValue('equipment', next, { shouldDirty: true, shouldTouch: true });
                  onFilterChange();
                }}
              >
                {EQUIPMENT_LABELS[eq]}
              </ToggleChipButton>
            );
          })}
        </div>
      </FieldBlock>
    </>
  );
}

const twoColumnRowCss = css`
  display: flex;
  gap: 12px;
`;

const equipmentRowCss = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
