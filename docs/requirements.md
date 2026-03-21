## 과제 설명

"회의실 예약" 화면을 구현해주세요.

날짜를 선택해 회의실 예약 현황을 확인하고, 원하는 시간/인원/장비 조건으로 예약을 시도합니다.

### 요구사항

---

- `/src/pages/ReservationStatusPage/index.tsx` — 예약 현황 보기 페이지
- `/src/pages/RoomBookingPage/index.tsx` — 예약하기 페이지
- `src/pages/components` 폴더 아래의 컴포넌트를 활용해주세요. (없다면 자유롭게 생성해도 됩니다.)

## 페이지 구조

서비스는 2개의 페이지로 구성됩니다.

### 페이지 1: 예약 현황 보기 (`/`)

- [ ] 날짜 선택 (DatePicker)
- [ ] 예약 현황 타임라인 (Timeline)
- [ ] 내 예약 목록 (MyReservations) + 예약 취소 기능
- [ ] "예약하기" 버튼 → 예약하기 페이지(`/booking`)로 이동

### 페이지 2: 예약하기 (`/booking`)

- [ ] 뒤로가기 → 예약 현황 페이지(`/`)로 이동
- [ ] 예약 조건 입력 (FilterPanel): 날짜, 시작/종료 시간, 참석 인원, 필요 장비, 선호 층
- [ ] 예약 가능 회의실 목록 (AvailableRoomList) + 예약 생성 기능
- [ ] 필터 조건은 URL 쿼리 파라미터로 공유 가능

## 기능 요구사항

### 1. 회의실 목록을 서버에서 불러와 출력해주세요

1. [ ] 회의실 목록 API는 `회의실` 목록 `조회 (GET /api/rooms)` 를 참고해주세요.
2. [ ] 날짜별 예약 현황을 불러와 타임라인으로 보여주세요
   1. 예약 현황 API는 `예약 현황 조회 (GET /api/reservations)` 를 참고해주세요.
   2. 사용자가 날짜를 변경하면 해당 날짜의 예약 현황을 다시 불러와야 합니다.
3. [ ] 링크를 통해 내가 선택한 필터가 포함된 회의실 정보를 공유할 수 있게 해주세요.

### 2. 예약 조건 입력 UI를 구현해주세요

사용자가 아래 조건을 입력할 수 있어야 합니다.

- [ ] 날짜 (기본: 오늘)
- [ ] 시작 시간 / 종료 시간
  1. 예약 현황은 "회의실별 타임라인" 형태로 보여주세요.
  2. 타임라인의 시간 범위는 `09:00 ~ 20:00`로 고정해요.
     1. 30분 간격으로 설정 가능해요. ex) 09:00 ~ 09:30
- [ ] 참석 인원
- [ ] 필요한 장비(복수 선택 가능)
- [ ] 선호 층(옵션)
  - [ ] 미선택 시 전체 층 대상
  - [ ] 회의실 목록에서 사용하는 층을 선택할 수 있어요.
  - [ ] 전체 회의실 목록에 해당하는 층을 선택할 수 있어요.

입력값에 대한 간단한 검증을 해주세요.

- [ ] 종료 시간은 시작 시간보다 늦어야 함
- [ ] 참석 인원은 1 이상

### 3. "예약 가능" 회의실만 필터링해서 보여주세요

입력한 조건에 맞춰 예약 가능한 회의실만 "가능 목록"으로 보여주세요.

### 필터 조건

1. 수용 인원
   - [ ] `room.capacity >= attendees`
2. 장비 포함
   - [ ] 선택한 장비가 모두 `room.equipment`에 포함
3. 층 조건(옵션)
   - [ ] 선호 층이 있다면 `room.floor === preferredFloor`
4. 시간 충돌 없음
   - [ ] 같은 날짜에 동일 roomId 예약들과 `[start, end)`가 겹치면 불가

### 4. 회의실 선택 & 예약 생성 기능을 구현해주세요

1. [ ] 예약 가능 목록에서 회의실을 하나 선택할 수 있어야 합니다.
2. [ ] 선택된 회의실은 선택 표시를 해주세요.
3. [ ] `예약하기` 버튼 클릭 시 예약 생성 API를 호출합니다.

- [ ] 예약 생성 API는 `예약 생성 (POST /api/reservations)` 를 참고해주세요.
- [ ] 예약 성공 시:
  - [ ] 성공 메시지를 표시하고 예약 현황 페이지(`/`)로 자동 이동합니다.
  - [ ] 해당 날짜의 예약 현황을 다시 불러와 UI에 반영해주세요.
- [ ] 예약 실패 시:
  - [ ] 서버에서 반환된 에러 메시지를 화면에 표시합니다.
  - [ ] 선택된 회의실을 초기화합니다.

✅ 예약 시도 시 아래는 반드시 체크해주세요.

- [ ] 회의실을 선택하지 않으면 "회의실을 선택해주세요"
- [ ] 시작/종료 시간이 유효하지 않으면 적절한 메시지 출력

### 5. 내 예약 목록을 구현해주세요

1. 내 예약 목록 API는 `내 예약 조회 (GET /api/my-reservations)` 를 참고해주세요.
2. 각 예약 항목에 대해 아래 정보를 표시해주세요.
   - [ ] 날짜, 시간, 회의실명, 참석 인원, 장비
3. 예약 취소 기능을 구현해주세요.
   - [ ] 예약 취소 API는 `예약 취소 (DELETE /api/reservations/:id)` 를 참고해주세요.
   - [ ] 취소 성공 시 목록에서 제거 + 예약 현황도 갱신

## 세부 결정 사항

### 타임라인 예약 블록 클릭

- [ ] 클릭 시 해당 예약의 상세 정보(시간, 인원, 장비)를 툴팁/팝오버로 보여준다.

### 예약 가능 회의실 정렬 기준

- [ ] 층수 오름차순 → 이름순으로 정렬한다.

### 예약 취소 확인 절차

- [ ] "정말 취소하시겠습니까?" 확인 다이얼로그를 거친 후 취소한다.

### 과거 날짜 예약 방지

- [ ] 과거 날짜는 선택 자체를 막는다 (input min 속성으로 오늘 이후만 허용).

### 필터 변경 시 회의실 선택 초기화

- [ ] 필터 조건(날짜, 시간, 인원, 장비, 층)을 변경하면 선택된 회의실과 에러 메시지를 초기화한다.

### 필터 조건 미완성 시 목록 미표시

- [ ] 시작 시간과 종료 시간이 모두 입력되어야 예약 가능 회의실 목록을 표시한다.
- [ ] 유효성 검증 오류가 있으면 목록을 표시하지 않는다.

### 예약 중 로딩 상태

- [ ] 예약 API 호출 중에는 확정 버튼을 비활성화하고 "예약 중..." 텍스트를 표시한다.

### 빈 상태 메시지

- [ ] 내 예약이 없으면 "예약 내역이 없습니다." 메시지를 표시한다.
- [ ] 조건에 맞는 회의실이 없으면 "조건에 맞는 회의실이 없습니다." 메시지를 표시한다.

### 카운트 표시

- [ ] 예약 가능 회의실 목록 헤더에 개수를 표시한다. (예: "3개")
- [ ] 내 예약 목록 헤더에 건수를 표시한다. (예: "3건")

### 시간 선택 범위

- [ ] 시작 시간은 09:00 ~ 19:30 중 선택 가능하다. (마지막 슬롯 제외)
- [ ] 종료 시간은 09:30 ~ 20:00 중 선택 가능하다. (첫 슬롯 제외)

---

## API 정보

---

### 회의실 목록 조회

**GET** `/api/rooms`

### Request Param

없음

### Response

```tsx
{
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: ('tv' | 'whiteboard' | 'video' | 'speaker')[]
};
```

---

### 예약 현황 조회

**GET** `/api/reservations`

### Request Param

```tsx
{
  date: string; // YYYY-MM-DD
}
```

> 예시
>
> `/api/reservations?date=2026-02-10`

### Response

```tsx
{
  id: string;
  roomId: string;
  date: string;  // YYYY-MM-DD
  start: string; // HH:mm
  end: string;   // HH:mm
  attendees: number;
  equipment: ('tv' | 'whiteboard' | 'video' | 'speaker')[]
};
```

---

### 예약 생성

**POST** `/api/reservations`

### Request Param

```tsx
{
  roomId: string;
  date: string;      // YYYY-MM-DD
  start: string;     // HH:mm
  end: string;       // HH:mm
  attendees: number;
  equipment: ('tv' | 'whiteboard' | 'video' | 'speaker')[]
};
```

### Response

성공

```tsx
{
  ok: true;
  reservation: Reservation;
}
```

실패

```tsx
{
  ok: false;
  code: 'CONFLICT' | 'INVALID' | 'NOT_FOUND';
  message: string;
}
```

---

### 내 예약 조회

**GET** `/api/my-reservations`

### Request Param

없음

### Response

```tsx
{
  id: string;
  roomId: string;
  date: string;  // YYYY-MM-DD
  start: string; // HH:mm
  end: string;   // HH:mm
  attendees: number;
  equipment: ('tv' | 'whiteboard' | 'video' | 'speaker')[]
};
```

---

### 예약 취소

**DELETE** `/api/reservations/:id`

### Request Param

```tsx
{
  id: string; // path param
}
```

### Response

```tsx
{
  ok: true;
}
```

---
