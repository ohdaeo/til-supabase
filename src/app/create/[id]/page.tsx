"use client";
import { useParams, useRouter } from "next/navigation";
// nanoid
import { nanoid } from "nanoid";
// scss
import styles from "@/app/create/[id]/page.module.scss";
// action
import {
  deleteTodo,
  getTodoId,
  updateTodoId,
  updateTodoIdTitle,
} from "@/app/actions/todos-action";
// component
import BasicBoard from "@/components/common/board/BasicBoard";
// shadcn/ui
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronLeftIcon } from "lucide-react";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/app/store";

// contents 배열에 대한 타입 정의
interface BoardContent {
  isCompleted: boolean;
  title: string;
  content: string;
  startDate: string | Date;
  endDate: string | Date;
  boardId: string; // 랜던함 아이디를 생성해줄 예정
}

function Page() {
  // jotai 상태 사용하기
  const [sidebarState, setSideState] = useAtom(sidebarStateAtom);

  const router = useRouter();
  const { id } = useParams();
  // 데이터 출력 state
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<BoardContent[]>([]);
  const [startDate, setStarDate] = useState<undefined | Date>(new Date());
  const [endDate, setEndDate] = useState<undefined | Date>(new Date());
  // Progress Bar 처리
  const [completeCount, setCompleteCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Page 삭제 함수
  const handleDeleteBoard = async () => {
    // console.log(id, "제거하라");
    const { error, status } = await deleteTodo(Number(id));
    if (!error) {
      setSideState("delete");
    }
  };

  // 타이틀 저장 함수
  const handleSaveTitle = async () => {
    const { data, error, status } = await updateTodoIdTitle(
      Number(id),
      title,
      startDate,
      endDate
    );

    // jotai의 State 갱신
    setSideState("titleChange");
  };
  // 컨텐츠 삭제 함수
  const deleteContent = async (deleteBoardId: string) => {
    // console.log("삭제할 컨텐츠 boardId ", deleteBoardId);
    const tempConentArr = contents.filter(
      (item) => item.boardId !== deleteBoardId
    );
    // 서버에 Row 를 업데이트 합니다.
    const { data, error, status } = await updateTodoId(
      Number(id),
      JSON.stringify(tempConentArr)
    );

    fetchGetTodoId();
  };

  // 컨텐츠 데이터 업데이트 함수
  const updateContent = async (newData: BoardContent) => {
    // console.log("최종전달 ", newData);

    const newContentArr = contents.map((item) => {
      if (item.boardId === newData.boardId) {
        return newData;
      }
      return item;
    });
    // 서버에 Row 를 업데이트 합니다.
    const { data, error, status } = await updateTodoId(
      Number(id),
      JSON.stringify(newContentArr)
    );

    fetchGetTodoId();
  };

  // id 에 해당하는 Row 데이터를 읽어오기
  const fetchGetTodoId = async () => {
    const { data, error, status } = await getTodoId(Number(id));
    // 에러 발생시
    if (error) {
      toast.error("데이터 호출 실패", {
        description: `데이터 호출에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 호출 성공", {
      description: "데이터 호출에 성공하였습니다",
      duration: 3000,
    });

    setTitle(data?.title ? data.title : "");
    setStarDate(data?.start_date ? new Date(data.start_date) : new Date());
    setEndDate(data?.end_date ? new Date(data.end_date) : new Date());
    const temp = data?.contents ? JSON.parse(data.contents as string) : [];
    setContents(temp);
    // 목록 갱신시
    calcCompletedCount(temp);
  };
  // contents 의 isCompleted 가 true 인 갯수 파악하기
  const calcCompletedCount = (gogo: BoardContent[]) => {
    const arr = gogo.filter((item) => item.isCompleted === true);
    // console.log("count : ", arr.length);
    setCompleteCount(arr.length);
    setTotalCount((arr.length / gogo.length) * 100);
  };

  // 컨텐츠 추가하기
  const initData: BoardContent = {
    boardId: nanoid(),
    title: "",
    content: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    isCompleted: false,
  };

  const onCreateContent = async (newData: BoardContent) => {
    const addContent = newData;
    // 기본으로 추가될 내용

    const updateContent = [...contents, addContent];
    // console.log("updateContent : ", updateContent);
    // 서버에 Row 를 업데이트 합니다.
    const { data, error, status } = await updateTodoId(
      Number(id),
      JSON.stringify(updateContent)
    );

    // 에러 발생시
    if (error) {
      toast.error("데이터 컨텐츠 업데이트 실패", {
        description: `데이터 컨텐츠 업데이트에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 컨텐츠 업데이트 성공", {
      description: "데이터 컨텐츠 업데이트에 성공하였습니다",
      duration: 3000,
    });

    // 자료 새로 후출
    fetchGetTodoId();
  };

  useEffect(() => {
    // jotai의 State 갱신
    setSideState("add Page");
    fetchGetTodoId();
  }, []);

  return (
    <div className={styles.container}>
      {/* board 메뉴 */}
      <div className="absolute flex w-full items-center justify-center p-3">
        <div className="flex-1">
          <Button variant={"outline"} onClick={() => router.push("/")}>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={handleSaveTitle}>
            저장
          </Button>
          <Button variant={"outline"} onClick={handleDeleteBoard}>
            삭제
          </Button>
        </div>
      </div>
      {/* 상단 */}
      <header className={styles.container_header}>
        <div className={styles.container_header_contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* 진행율 */}
          <div className={styles.progressBar}>
            <span className={styles.progressBar_status}>
              {completeCount}/{contents.length} completed!
            </span>
            {/* Progress 컴포넌트 배치 */}
            <Progress
              value={totalCount}
              className="w-[30%] h-2"
              indicateColor="bg-orange-500"
            />
          </div>
          {/* 캘린더 선택 추가 */}
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox_calendar}>
              <LabelCalendar
                label="From"
                required={false}
                selectedDate={startDate}
                onDateChange={setStarDate}
              />
              <LabelCalendar
                label="To"
                required={false}
                selectedDate={endDate}
                onDateChange={setEndDate}
              />
            </div>
            <Button
              variant={"outline"}
              className="w-[15%] text-white bg-orange-400 border-orange-500 hover:bg-orange-400 hover:text-white cursor-pointer"
              onClick={() => onCreateContent(initData)}
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      {/* 본문 */}
      <div className={styles.container_body}>
        {/* conents 배열의 개수 만큼 출력이 되어야 함. */}
        {contents.length == 0 ? (
          <div className={styles.container_body_infoBox}>
            <span className={styles.title}>There is no board yet. </span>
            <span className={styles.subTitle}>
              Click the button and start flashing!
            </span>
            <button
              className={styles.button}
              onClick={() => onCreateContent(initData)}
            >
              <Image
                src="/assets/images/round-button.svg"
                alt="add board"
                width={100}
                height={100}
              />
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Page;
