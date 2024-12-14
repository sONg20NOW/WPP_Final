'use client'

import { deletePage, getNotes, togglePinned } from "@/actions";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

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

  const handlePin = (e) => {
    e.stopPropagation();
    toast.info(!Note.pinned ? "Pinned!" : "Unpinned!", {autoClose: 1000});
    togglePinned(Note);
    router.refresh();
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    deletePage(Note);
    toast.info("Deleted!", {autoClose: 1000})
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
  }

  return (
    <div onClick={SelectPage} className={clsx("flex justify-between px-3 text-zinc-500 fill-zinc-500 ",
      active ? 'bg-zinc-200 hover:bg-sky-200 hover:text-zinc-600 hover:fill-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200',
    )}>
      <div className={clsx("flex justify-start m-0 py-1.5 font-bold text-sm",)}>
        <div className="mr-1.5 flex">
          {Note.pinned ? 
          <svg className={clsx(
            "size-5 h-full",
          )}
          onClick={handlePin} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg> :
          <svg className={clsx(
            "w-5 h-5 h-full text-transparent ",
            active ? "hover:text-zinc-600" : "hover:text-zinc-500"
            )} 
            onClick={handlePin}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          }
          

          
        </div>
        {Note.title}
      </div>
      {/* delete button */}
      <button onClick={handleDelete}className="text-red-700 hover:text-red-500">X</button>
    </div>
  );
}

export default Doc;