'use client';

import { changeContent, changeTitle, getContent, getTitle, getUserByNote, toggleShare } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ToC from "./ToC";
import { toast } from "react-toastify";

export default function Main({ Notes }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentNoteId = parseInt(searchParams.get("id"), 10) || Notes[0]?.id;
    const userId = searchParams.get('userId');
    const keyword = searchParams.get('keyword') || "";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    // Text Formatting
    const [isMarkdown, setIsMarkdown] = useState(true);

    // ToC
    const [isToggle, setIsToggle] = useState(false);

    // Share
    const [userName, setUserName] = useState("");
    const currentNote = Notes.find(Note => Note.id == currentNoteId);
    const isMyNote = (currentNote?.userId == userId) || false;

    useEffect(() => {
        let isMounted = true;
        if (!currentNoteId) {
            setLoading(false); // No notes to load
            return;
        }

        async function fetchData() {
            try {
                const title = await getTitle(currentNoteId);
                const content = await getContent(currentNoteId);
                const user = await getUserByNote(currentNote);
                if (isMounted) {
                    setTitle(title || "");
                    setContent(content || "");
                    setUserName(user?.userName || "");
                    setIsToggle(false);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [currentNoteId]);

    useEffect(() => {
        setIsMarkdown(true);
    }, [keyword])

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        changeTitle(currentNoteId, newTitle);
        router.refresh();
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        changeContent(currentNoteId, newContent);
        router.refresh();
    };

    const handleLogout = () => {
        router.push('/login');
        toast.info("Logged out!")
    }

    const highlightKeyword = (text, keyword) => {
        if (!keyword.trim()) return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        )); // Return text with line breaks if keyword is empty
    
        const regex = new RegExp(`(${keyword})`, "gi");
        const parts = text.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
                {line.split(regex).map((part, index) =>
                    regex.test(part) ? (
                        <mark key={index} className="bg-yellow-300">
                            {part}
                        </mark>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
                <br />
            </span>
        ));
        return parts;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <span>Loading...</span>
            </div>
        );
    }

    if (!currentNoteId) {
        return (
            <div className="grow flex items-center justify-center">
                <span>There is no notes in DB. Please add a new note.</span>
                <div className="fixed right-8 top-8 flex flex-col gap-2">
                    <button
                        onClick={handleLogout}
                        className="btn btn-default"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    const commonStyle = "w-full h-full rounded-lg border-2 border-gray-200 px-2 text-black dark:bg-neutral-200";

    return (
        <div className="grow py-32 m-0 text-zinc-900 bg-white text-lg dark:bg-neutral-950 dark:text-white flex justify-center">
            <div className="flex-1"></div>
            <div className="flex-[2]">
                {!keyword.trim() ? (
                    // 일반 제목
                    <input
                        value={title}
                        onChange={handleTitleChange}
                        className="rounded-md focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-2 text-4xl font-bold w-full h-12 mb-12 px-1 text-zinc-900 bg-white dark:bg-neutral-950 dark:text-white"
                    />
                ) : (
                    // 검색 결과 제목
                    <div
                        className="rounded-md focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-2 text-4xl font-bold w-full h-12 mb-12 px-1 text-zinc-900 bg-white dark:bg-neutral-950 dark:text-white"
                    >{highlightKeyword(title, keyword)}</div>
                )}
                <div className="w-full h-4/5 border-2 border-gray-200 rounded-lg overflow-y-auto">
                    {!isMarkdown ? (
                        <Markdown
                            className="w-full h-full prose dark:prose-dark text-black px-2 dark:bg-neutral-200"
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {content}
                        </Markdown>
                    ) : (
                        !keyword.trim() ? (
                            // 일반 내용
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                className="w-full h-full rounded-lg focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-0.5 text-black px-2 dark:bg-neutral-200"
                            />
                        ) : (
                            // 검색 결과 내용
                            <div
                                className="w-full h-full rounded-lg focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-0.5 text-black px-2 dark:bg-neutral-200"
                            >{highlightKeyword(content, keyword)}</div>
                        )
                    )}
                </div>
                {!isMyNote && (
                    <div className="mt-4 flex items-center justify-start gap-2 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-neutral-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>

                        <span className="text-s font-medium text-gray-800 dark:text-gray-200">
                            Shared by <span className="font-semibold text-blue-600 dark:text-blue-400">{userName}</span>
                        </span>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <ToC markdownContent={content} isToggle={isToggle}/>
            </div>
            <div className="fixed right-8 top-8 flex gap-2">
                {(isMyNote) && 
                (<button onClick={() => {
                    toast.info(currentNote.share? "This note is un-shared!" : "This note is shared!", {autoClose: 1000})
                    toggleShare(currentNote);
                    router.refresh();
                }}
                className="btn btn-neutral">
                    {currentNote.share ? "Un-share": "Share"}
                </button>)}
                <button
                    onClick={() => {
                        setIsToggle(!isToggle);
                    }}
                    className="btn btn-outline w-fit"
                >
                    ToC
                </button>
                <button
                    onClick={() => {
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete('keyword');
                        const newPath = `/?${newSearchParams.toString()}`
                        router.push(newPath);
                        setIsMarkdown(!isMarkdown);
                    }}
                    className="btn btn-neutral"
                >
                    {keyword.trim() ? ("Highlight") : (!isMarkdown ? "View" : "Edit")}
                </button>
                <button
                    onClick={handleLogout}
                    className="btn btn-default"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
