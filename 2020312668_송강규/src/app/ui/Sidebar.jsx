'use client';

import { useState } from "react";
import Doc from "./Doc";
import NewPage from "./NewPage";
import { searchNotes } from "@/actions";
import SearchList from "./SearchList";
import Link from "next/link";

export default function Sidebar({ Notes, User }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [foundNotes, setFoundNotes] = useState([]);


    const profileSParams = "";
    const newSParams = new URLSearchParams(profileSParams);
    newSParams.set('userId', User.id);
    const newProfilePath = `/profile/?${newSParams.toString()}`;

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        setKeyword("");
        setFoundNotes([]);
    };

    const handleKeywordChange = async (e) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);

        try {
            const newFoundNotes = await searchNotes(newKeyword, User.id);
            setFoundNotes(newFoundNotes || []);
        } catch (error) {
            console.error("Failed to search notes:", error);
            setFoundNotes([]);
        }
    };


    return (
        <div className="w-60 bg-zinc-100 p-0 flex flex-col m-0 text-zinc-900 text-xs font-bold">
            <div className="hover:bg-zinc-200 flex justify-between my-1 py-1 px-1.5 m-2">
                <Link href={newProfilePath} className="flex flex-row items-center cursor-pointer">
                  <img
                      className="rounded w-12 h-12"
                      src={User.profileImg ? `data:image/png;base64,${Buffer.from(User.profileImg).toString("base64")}` : "/assets/default-profile.png"}
                      alt="Profile"
                  />
                  <p className="px-4 font-semibold text-3xl text-zinc-700">{User.userName}</p>
                </Link>
            </div>
            <div className="m-1 mx-2">
                <button
                    className="hover:bg-zinc-200 flex w-full justify-start py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm mb-1"
                >
                    <div className="mr-1.5">
                      <svg className="w-5 h-5 h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                    Setting
                </button>
                <button
                    onClick={handleSearchToggle}
                    className="hover:bg-zinc-200 flex w-full justify-start py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm mb-1"
                >
                    <div className="mr-1.5">
                        <svg role="graphics-symbol" viewBox="0 0 20 20" className="w-5 h-5 h-full">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"
                            ></path>
                        </svg>
                    </div>
                    Search
                </button>
            </div>
            <div className="ml-2.5 text-zinc-400 mb-1">
                <p>Private</p>
            </div>
            <div>
                {Notes.map((Note) => (
                    <Doc key={Note.id} Notes={Notes} Note={Note} />
                ))}
                <NewPage />
            </div>

            {isSearchOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg p-5 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Search Notes</h2>
                        <input
                            onChange={handleKeywordChange}
                            type="text"
                            value={keyword}
                            name="keyword"
                            placeholder="Type to search..."
                            className="w-full p-2 border rounded mb-4"
                        />
                        <SearchList NotesFound={foundNotes} keyword={keyword} setIsSearchOpen={setIsSearchOpen} />
                        <div className="w-full flex justify-between">
                            <button
                                type="button"
                                onClick={handleSearchToggle}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
