'use client';

import { createNewPage } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

// 사이드바에 New Page 버튼
const NewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get("userId"), 10);
  
  return (
    <div onClick={async () => {
      if (!userId) {
        toast.error("Invalid or missing user!");
        return;
      }
      const noteId = await createNewPage(userId);
      const currentNoteId = parseInt(searchParams?.get("id"), 10) || 0;
      // 만약 현재 아무 노트도 선택되어 있지 않은 경우
      if (currentNoteId) {
        router.refresh();
      }
      else {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('id', noteId);
        const newPath = `/?${newSearchParams.toString()}`;
        router.push(newPath);
      }

      toast.info("Created!", {autoClose: 1000});
    }} className={`flex justify-start m-0 px-3 py-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm bg-zinc-100 hover:bg-zinc-200`}>
      <div className="mr-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z" clipRule="evenodd" />
          <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
        </svg>
      </div>
      New Page
    </div>
  );
}

export default NewPage;
  