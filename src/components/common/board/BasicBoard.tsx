"use client";
import styles from "@/components/common/board/BasicBoard.module.scss";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp } from "lucide-react";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import MarkdownDialog from "../dialog/MarkdownDialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

// contents 배열에 대한 타입 정의
interface BoardContent {
  isCompleted: boolean;
  title: string;
  content: string;
  startDate: string | Date;
  endDate: string | Date;
  boardId: string; // 랜던함 아이디를 생성해줄 예정
}

interface BasicBoardProps {
  item: BoardContent;
  updateContent: (newData: BoardContent) => void;
  deleteContent: (boardId: string) => void;
}

function BasicBoard({ item, updateContent, deleteContent }: BasicBoardProps) {
  const [isComplted, setIsCompleted] = useState<boolean>(item.isCompleted);

  useEffect(() => {
    setIsCompleted(item.isCompleted);
  }, [item]);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.container_header}>
        <div className={styles.container_header_titleBox}>
          <Checkbox
            className="w-5 h-5"
            checked={isComplted}
            onCheckedChange={() => {
              item.isCompleted = !item.isCompleted;
              updateContent(item);
              setIsCompleted(item.isCompleted);
            }}
          />
          <span className={styles.title}>
            {item.title ? item.title : "Please enter a title for your board"}
          </span>
          <Button variant={"ghost"}>
            <ChevronUp calcMode="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* 본문 */}
      <div className={styles.container_body}>
        <div className={styles.container_body_calendarBox}>
          <LabelCalendar
            label="From"
            required={true}
            selectedDate={new Date(item.startDate)}
          />
          <LabelCalendar
            label="To"
            required={true}
            selectedDate={new Date(item.endDate)}
          />
          {/* <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">From</span>
            <Input value={item.startDate.toString().split("T")[0]} disabled />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#6d6d6d]">From</span>
            <Input value={item.endDate.toString().split("T")[0]} disabled />
          </div> */}
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
            onClick={() => deleteContent(item.boardId)}
          >
            Delete
          </Button>
        </div>
      </div>
      {/* 하단 */}
      <div className={styles.container_footer}>
        <MarkdownDialog item={item} updateContent={updateContent} />
      </div>
    </div>
  );
}

export default BasicBoard;
