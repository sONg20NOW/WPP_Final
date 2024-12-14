'use client';

import { changeContent, changeTitle, getContent, getTitle } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ToC from "./ToC";

export default function Main({ Notes }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentNoteId = parseInt(searchParams.get("id"), 10) || Notes[0]?.id;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    // Text Formatting
    const [isMarkdown, setIsMarkdown] = useState(true);

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
                if (isMounted) {
                    setTitle(title || "");
                    setContent(content || "");
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
                        onClick={() => {
                            router.push('/login');
                        }}
                        className="btn btn-default"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grow py-32 m-0 text-zinc-900 bg-white text-lg dark:bg-neutral-950 dark:text-white flex justify-center">
            <div className="flex-1"></div>
            <div className="flex-grow">
                <input
                    value={title}
                    onChange={handleTitleChange}
                    className="rounded-md focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-2 text-4xl font-bold w-full h-12 mb-12 px-1 text-zinc-900 bg-white dark:bg-neutral-950 dark:text-white"
                />
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
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full h-full rounded-lg focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-0.5 text-black px-2 dark:bg-neutral-200"
                        />
                    )}
                </div>
            </div>
            <div className="flex-1">
                <ToC markdownContent={content}/>
            </div>
            <div className="fixed right-8 top-8 flex gap-2">
                <button
                    onClick={() => {
                        router.push('/login');
                    }}
                    className="btn btn-default"
                >
                    Logout
                </button>
                <button
                    onClick={() => {
                        setIsMarkdown(!isMarkdown);
                    }}
                    className="btn btn-neutral"
                >
                    {!isMarkdown ? "View" : "Edit"}
                </button>
            </div>
        </div>
    );
}
