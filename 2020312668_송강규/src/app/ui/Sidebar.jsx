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
            {/* profile image */}
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
            {/* setting 버튼과 search 버튼 */}
            <div className="m-1 mx-2">
                <button
                    className="hover:bg-zinc-200 flex w-full justify-start items-center py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm mb-1"
                >
                    <div className="mr-1.5">
                      <svg className="size-5 h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Setting
                </button>
                <button
                    onClick={handleSearchToggle}
                    className="hover:bg-zinc-200 flex w-full justify-start py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm mb-1"
                >
                    <div className="mr-1.5">
                        <svg role="graphics-symbol" viewBox="0 0 20 20" className="size-5 h-full">
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
            {/* 디자인 */}
            <div className="ml-2.5 text-zinc-400 mb-1">
                <p>Notes</p>
            </div>
            {/* 문서 목록 */}
            <div>
                {Notes.map((Note) => (
                    <Doc key={Note.id} Notes={Notes} Note={Note} />
                ))}
                <NewPage />
            </div>

            {/* 검색창 */}
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
