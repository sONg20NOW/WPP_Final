'use client'

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchList({ NotesFound, keyword, setIsSearchOpen }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectList = (Note) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('id', Note.id);
        newSearchParams.set('keyword', keyword);
        const newPath = `/?${newSearchParams.toString()}`;
        setIsSearchOpen(false);
        router.push(newPath);
    }

    return (
        <div className="flex flex-col w-full p-4 bg-gray-100 rounded-md shadow-md">
            {NotesFound.length > 0 ? (
                NotesFound.map((Note) => (
                    <div
                        onClick={() => {selectList(Note)}}
                        key={Note.id}
                        className="p-3 mb-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <p className="text-lg font-semibold text-gray-800">
                            {Note.title}
                        </p>
                        <p className="text-sm text-gray-600">
                            Matched keyword: <span className="text-blue-500">'{keyword}'</span>
                        </p>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600 text-lg font-medium">No results found</p>
                    <p className="text-sm text-gray-500">
                        for keyword: <span className="text-blue-500">'{keyword.length === 0 ? " " : keyword}'</span>
                    </p>
                </div>
            )}
        </div>
    );
}
