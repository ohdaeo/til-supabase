# test

## 1. 목록에서 Page 이동하기

- SideNavigation.tsx

```tsx
{
  todos!.map((item) => (
    <div
      key={item.id}
      className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
      onClick={() => router.push(`/create/${item.id}`)}
    >
      <Dot className="mr-1 text-green-400" />
      <span className="text-sm">{item.title ? item.title : "No Title"}</span>
    </div>
  ));
}
```

## 2. Page에서 목록 스크롤 시키기

- /src/app/create/[id]/page.tsx
- `overflow-y-scroll`

```tsx
<div className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-scroll">
  {contents.map((item) => (
    <BasicBoard
      key={item.boardId}
      item={item}
      updateContent={updateContent}
      deleteContent={deleteContent}
    />
  ))}
</div>
```

- global.css 추가

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  body {
    @apply bg-background text-foreground;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
```

## 3. progress 정리하기

- /src/app/create/[id]/page.tsx

```tsx
// Progress Bar 처리
const [completeCount, setCompleteCount] = useState<number>(0);
const [totalCount, setTotalCount] = useState<number>(0);
```

```tsx
// contents 의 isCompleted 가 true 인 갯수 파악하기
const calcCompletedCount = (gogo: BoardContent[]) => {
  const arr = gogo.filter((item) => item.isCompleted === true);
  // console.log("count : ", arr.length);
  setCompleteCount(arr.length);
  setTotalCount((arr.length / gogo.length) * 100);
};
```

```tsx
<span className={styles.progressBar_status}>
  {completeCount}/{contents.length} completed!
</span>
```

```tsx
<Progress
  value={totalCount}
  className="w-[30%] h-2"
  indicateColor="bg-orange-500"
/>
```

### checkbox 처리 필요

- BasicBoard.tsx

```tsx
const [isComplted, setIsCompleted] = useState<boolean>(item.isCompleted);
```

```tsx
useEffect(() => {
  setIsCompleted(item.isCompleted);
}, [item]);
```

```tsx
<Checkbox
  className="w-5 h-5"
  checked={isComplted}
  onCheckedChange={() => {
    item.isCompleted = !item.isCompleted;
    updateContent(item);
    setIsCompleted(item.isCompleted);
  }}
/>
```

- MarkdownDialog.tsx

```tsx
const [isCheckComplted, setIsCheckCompleted] = useState<boolean>(
  item.isCompleted
);
```

```tsx
<Checkbox
  className="w-5 h-5"
  checked={isCheckComplted}
  onCheckedChange={() => {
    setIsCheckCompleted(!isCheckComplted);
  }}
/>
```

- onSubmit

```tsx
 isCompleted: isCheckComplted,
```
