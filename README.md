✏

# MarkDown Editor

- `/src/components/common/board/BasicBoard.tsx`

```tsx
import styles from "@/components/common/board/BasicBoard.module.scss";

const BasicBoard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <div className={styles.container_header_titleBox}>
          <span className={styles.title}>
            Please enter a title for your board
          </span>
        </div>
      </div>
      <div className={styles.container_body}></div>
    </div>
  );
};

export default BasicBoard;
```

- `/src/components/common/board/BasicBoard.module.scss`

[shadcn checkbox](https://ui.shadcn.com/docs/components/checkbox)

```bash
npx shadcn@latest add checkbox
```

### 기본예제

- src\components\common\board\BasicBoard.tsx

```tsx
import styles from "@/components/common/board/BasicBoard.module.scss";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

const BasicBoard = () => {
  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.container_header}>
        <div className={styles.container_header_titleBox}>
          <Checkbox className="w-5 h-5" />
          <span className={styles.title}>
            Please enter a title for your board
          </span>
          <Button variant={"ghost"}>
            <ChevronUp calcMode="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* 본문 */}
      <div className={styles.container_body}>
        <div className={styles.container_body_calendarBax}>
          캘린더 선택 버튼 작성예정
        </div>
        <div className={styles.container_body_buttonBox}>
          <Button
            variant={"ghost"}
            className="font-normal text-gray-400 hover:bg-green-500 hover:text-white"
          >
            Duplicate
          </Button>
          <Button
            variant={"ghost"}
            className="font-normal text-gray-400 hover:bg-red-500 hover:text-white"
          >
            Delete
          </Button>
        </div>
      </div>
      {/* 하단 */}
      <div className={styles.container_footer}></div>
    </div>
  );
};

export default BasicBoard;
```

2. create 페이지 만들기

- http://localhost:3000/create
- /src/app/create/page.tsx 파일 생성
- /src/app/create/page.module.scss 파일 생성

```tsx
import styles from "@/app/create/page.module.scss";
import BasicBoard from "@/components/common/board/BasicBoard";

function page() {
  return (
    <div className={styles.container}>
      {/* 상단 */}
      <header className={styles.container_header}>
        <div className={styles.container_header_contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
          />
        </div>
        <div className={styles.progressBar}>
          <span className={styles.progressBar_status}>1/10 completed!</span>
          {/* Progress 컴포넌트 배치 */}
        </div>
      </header>
      {/* 본문 */}
      <div className={styles.container_body}>
        <BasicBoard />
      </div>
    </div>
  );
}

export default page;
```

3. Progress

```bash
npx shadcn@latest add progress
```

- src\app\create\page.tsx

```tsx
/* 진행율 */
<div className={styles.progressBar}>
  <span className={styles.progressBar_status}>1/10 completed!</span>
  {/* Progress 컴포넌트 배치 */}
  <Progress value={33} />
</div>
```

3-1. indicateColor 추가하기

- src\app\create\page.tsx

```tsx
<Progress value={33} className="w-[30%] h-2" indicateColor="bg-orange-500" />
```

- src\components\ui\progress.tsx

```tsx
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// 사용자 정의 인터페이스
interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicateColor?: string;
}

function Progress({
  className,
  value,
  indicateColor,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`h-full w-full flex-1 transition-all ${indicateColor && indicateColor}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
```

4. calendar

[shadcn calendar](https://ui.shadcn.com/docs/components/calendar)

```bash
npx shadcn@latest add calendar
```

```bash
npx shadcn@latest add popover
```

- src\components\common\calendar\LabelCalendar.tsx
- src\components\common\calendar\LabelCalendar.module.scss

```tsx
"use client";
import { useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import styles from "@/components/common/calendar/LabelCalendar.module.scss";

interface LabelCalendarProps {
  label: string;
  required: boolean;
}
// required : true 면  날짜 선택
// required : false 면  날짜 선택 불가
function LabelCalendar({ label, required }: LabelCalendarProps) {
  const [date, setDate] = useState<Date>();
  return (
    <div className={styles.container}>
      <span className={styles.container_label}>{label}</span>
      {/* shadcn/ui Calendar 배치 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        {!required && (
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default LabelCalendar;
```

5. dialog
   [shadcn dialog](https://ui.shadcn.com/docs/components/dialog)

```bash
npx shadcn@latest add dialog
```

6. separator

[shadcn separator](https://ui.shadcn.com/docs/components/separator)

```bash
npx shadcn@latest add separator
```

- src\app\create\page.tsx
- src\components\common\board\BasicBoard.tsx

```tsx
/* 하단 */
<div className={styles.container_footer}>
  <MarkdownDialog />
</div>
```

- src\components\common\dialog\MarkdownDialog.tsx

```tsx
import styles from "@/components/common/dialog/MarkdownDialog.module.scss";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import LabelCalendar from "../calendar/LabelCalendar";
import { Separator } from "@/components/ui/separator";

const MarkdownDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Content
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-fit min-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog_titleBoc}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder=" Write a title for your board"
                className={styles.dialog_titleBox_title}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog_calendarBox}>
            <LabelCalendar label="From" required={false} />
            <LabelCalendar label="To" required={false} />
          </div>
          <Separator />
          {/* 마크다운 입력 영역 */}
          <div className={styles.dialog_markdown}>여기에 에디터배치</div>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog_buttonBox}>
            <Button
              variant={"ghost"}
              className="font-normal text-gray-400 hover:text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant={"ghost"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownDialog;
```

- src\components\common\dialog\MarkdownDialog.module.scss

### 심화예제 (마크다운 에디터)

1. MarkDown Editor

```bash
npm i @uiw/react-md-editor --legacy-peer-deps
```

```tsx
"use client";

import styles from "@/components/common/dialog/MarkdownDialog.module.scss";
import { Button } from "@/components/ui/button";

// Markdown Editor
import MDEditor from "@uiw/react-md-editor";

// shadcn
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@radix-ui/react-checkbox";
import LabelCalendar from "../calendar/LabelCalendar";
import { useState } from "react";

const MarkdownDialog = () => {
  // 에디터의 내용
  const [content, setContent] = useState<string | undefined>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Content
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-fit min-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog_titleBoc}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder=" Write a title for your board"
                className={styles.dialog_titleBox_title}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog_calendarBox}>
            <LabelCalendar label="From" required={false} />
            <LabelCalendar label="To" required={false} />
          </div>
          <Separator />
          {/* 마크다운 입력 영역 */}
          <div className={styles.dialog_markdown}>
            <MDEditor height={"100%"} value={content} onChange={setContent} />
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog_buttonBox}>
            <Button
              variant={"ghost"}
              className="font-normal text-gray-400 hover:text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant={"ghost"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownDialog;
```
