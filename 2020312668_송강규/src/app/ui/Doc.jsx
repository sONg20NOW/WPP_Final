'use client'

import { deletePage, getNotes, togglePinned } from "@/actions";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// 사이드바에 문서 버튼들
const Doc = ({Notes, Note}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNoteId = parseInt(searchParams?.get("id"), 10) || Notes[0].id;
  // if (isNaN(currentNoteId)) {
  //   currentNoteId = Notes[0].id;
  // }
  const active = (currentNoteId == Note.id)

  const userId = parseInt(searchParams.get("userId"), 10);

  const SelectPage = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('id', Note.id);
    const newPath = `/?${newSearchParams.toString()}`;
    router.push(newPath);
  }

  return (
    <div onClick={SelectPage} className={clsx("flex justify-between px-3 text-zinc-500 fill-zinc-500 ",
      active ? 'bg-zinc-200 hover:bg-sky-200 hover:text-zinc-600 hover:fill-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200',
    )}>
      <div className={clsx("flex justify-start m-0 py-1.5 font-bold text-sm",)}>
        <div className="mr-1.5 flex">
          <svg role="graphics-symbol" viewBox="0 0 16 16" className="w-4 h-4 h-full"><path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703ZM10.4336 9.00098H5.42969C5.16992 9.00098 4.98535 9.19238 4.98535 9.43164C4.98535 9.67773 5.16992 9.86914 5.42969 9.86914H10.4336C10.6797 9.86914 10.8643 9.67773 10.8643 9.43164C10.8643 9.19238 10.6797 9.00098 10.4336 9.00098ZM10.4336 11.2979H5.42969C5.16992 11.2979 4.98535 11.4893 4.98535 11.7354C4.98535 11.9746 5.16992 12.1592 5.42969 12.1592H10.4336C10.6797 12.1592 10.8643 11.9746 10.8643 11.7354C10.8643 11.4893 10.6797 11.2979 10.4336 11.2979Z"></path></svg>
          {Note.pinned ? 
          <svg className={clsx(
            "w-5 h-5 h-full",
          )}
          onClick={(e) => {
            e.stopPropagation();
            togglePinned(Note);
            router.refresh();
          }} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg> :
          <svg className={clsx(
            "w-5 h-5 h-full text-transparent ",
            active ? "hover:text-zinc-600" : "hover:text-zinc-500"
            )} 
            onClick={(e) => {
              e.stopPropagation();
              togglePinned(Note);
              router.refresh();
            }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          }
          

          
        </div>
        {Note.title}
      </div>
      {/* delete button */}
      <button onClick={async (e) => {
        e.stopPropagation();
        deletePage(Note);
        const remainNotes = await getNotes(userId);
        if (active) {
          const firstNoteId = remainNotes[0]?.id || 0;
          if (firstNoteId) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('id', firstNoteId);
            const newPath = `/?${newSearchParams.toString()}`;
            router.push(newPath);
          }
          // 남은 문서가 없는 경우
          else {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('id');
            const newPath = `/?${newSearchParams.toString()}`;
            router.push(newPath);
          }
        } else {
          router.refresh();
        }
      }}className="text-red-700 hover:text-red-500">X</button>
    </div>
  );
}

export default Doc;