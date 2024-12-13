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
      console.log("noteId: ", noteId);
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

      toast.success("New Page Created!");
    }} className={`flex justify-start m-0 px-3 py-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm bg-zinc-100 hover:bg-zinc-200`}>
      <div className="mr-1.5">
        <svg role="graphics-symbol" viewBox="0 0 16 16" className="w-4 h-4 h-full"><path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703ZM10.4336 9.00098H5.42969C5.16992 9.00098 4.98535 9.19238 4.98535 9.43164C4.98535 9.67773 5.16992 9.86914 5.42969 9.86914H10.4336C10.6797 9.86914 10.8643 9.67773 10.8643 9.43164C10.8643 9.19238 10.6797 9.00098 10.4336 9.00098ZM10.4336 11.2979H5.42969C5.16992 11.2979 4.98535 11.4893 4.98535 11.7354C4.98535 11.9746 5.16992 12.1592 5.42969 12.1592H10.4336C10.6797 12.1592 10.8643 11.9746 10.8643 11.7354C10.8643 11.4893 10.6797 11.2979 10.4336 11.2979Z"></path></svg>
      </div>
      New Page
    </div>
  );
}

export default NewPage;
  