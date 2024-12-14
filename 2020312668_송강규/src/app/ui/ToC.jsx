'use client'

import { useEffect, useState } from "react";

export default function ToC({markdownContent}) {
    const [toc, setToc] = useState([]);
    const [isToggle, setIsToggle] = useState(false);

    // Markdown 헤더 추출
    useEffect(() => {
        const lines = markdownContent.split('\n');
        const headers = lines
            .map((line) => {
                const match = line.match(/^(#{1,6})\s+(.*)/); // 헤더 검출
                if (match) {
                    return {
                        level: match[1].length, // #의 개수
                        text: match[2], // 헤더 제목
                    };
                }
                return null;
            })
            .filter(Boolean); // null 값 제거
        setToc(headers);
    }, [markdownContent]);


    return (
        <div className="flex flex-col gap-4 items-center justify-center mx-4">
            <button
                onClick={() => {
                    setIsToggle(!isToggle);
                }}
                className="btn btn-outline w-fit"
            >
                ToC
            </button>
            {/* 목차 영역 */}
            {
                isToggle && 
                    <div className="w-full p-4 bg-gray-100 rounded-xl">
                    <h2 className="font-bold mb-2">Table of Contents</h2>
                    <ul className="list-disc pl-4">
                        {toc.map((header, index) => (
                            <li
                                key={index}
                                style={{ marginLeft: `${(header.level - 1) * 10}px` }} // 들여쓰기
                            >
                                <a href={`#${header.text.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {header.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            }
            
        </div>
    );
}