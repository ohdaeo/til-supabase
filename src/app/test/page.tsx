"use client";

import { useState } from "react";
import { createTodos, getTodos } from "@/app/actions/test-action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/providers/ReactQueryProvider";

export default function Page() {
  const [testInput, setTestInput] = useState<string>("");

  // 데이터 가져오기
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["uniq"],
    queryFn: getTodos,
    retryDelay: 3000,
  });

  // 데이터 추가하기
  const createMutaion = useMutation({
    mutationFn: async () => {
      if (testInput.trim() === "") {
        alert("할일을 입력 해 주세요");
        return;
      }
      await createTodos(testInput);
    },
    onSuccess: () => {
      setTestInput("");
      refetch();
    },
    onError: (error) => {
      console.log("데이터 추가 실패", error.message);
    },
    onSettled: () => {
      console.log("어떠한 상황에서도 실행된다");
    },
  });

  // mutateAsync 사용하기
  const mutation = useMutation({
    mutationFn: createTodos,
  });
  const handleAdd = async () => {
    try {
      const now = await mutation.mutateAsync("Add Todo");
      console.log("데이터", now);
      queryClient.refetchQueries({ queryKey: ["uniq"] });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1>Test Todo</h1>
      <div>
        <Button onClick={() => handleAdd()}>Test</Button>
      </div>
      <div>
        <input
          type="text"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <Button
          disabled={createMutaion.isPending}
          onClick={() => createMutaion.mutate()}
          className="ml-2"
        >
          {createMutaion.isPending ? "추가중" : "할일추가"}
        </Button>
      </div>
      <div>
        <Button onClick={() => refetch()}>다시 호출하기</Button>
      </div>
      {isLoading && <div>데이터 로딩중 . . .</div>}
      {error && <div>에러가 발생했습니다. error code : {error.message}</div>}
      {data && (
        <div>
          {data.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
