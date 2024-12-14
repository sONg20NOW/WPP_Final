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
            <div className="flex justify-between my-1 py-1 px-1.5 m-2">
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
