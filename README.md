# Content

### content 데이터 출력 및 수정

1.  Props 로 모든 데이터를 전달함

- src\app\create\[id]\page.tsx

```tsx
<BasicBoard key={item.boardId} item={item} />
```

- src\components\common\board\BasicBoard.tsx

```tsx
function BasicBoard({ item }: { item: BoardContent }) {}
```
