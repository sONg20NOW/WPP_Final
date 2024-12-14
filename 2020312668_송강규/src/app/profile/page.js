'use client';

import { useEffect, useState } from "react";
import { getUserByUserId, updateProfileImage } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function ProfileEdit() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = parseInt(searchParams.get('userId'), 10);
    const [image, setImage] = useState(null);
    const [userName, setUserName] = useState(""); 

    useEffect(() => {
        async function fetchUserName() {
            try {
                const user = await getUserByUserId(userId); // userId로 유저 정보 가져오기
                setUserName(user?.userName || "Unknown User");
            } catch (error) {
                console.error("Failed to fetch user name:", error);
            }
        }
        fetchUserName();
    }, [userId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result); // Base64 encoded image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!image) {
            toast.error("Please upload an image!");
            return;
        }

        try {
            const response = await updateProfileImage(userId, image);
            if (response.success) {
                toast.success("Updated!");
                router.push(`/?userId=${userId}`)
            } else {
                toast.error(`Failed to update profile image: ${response.error}`);
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Edit Profile Img of <span className="text-blue-500">{userName}</span>
                </h1>
                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 mb-4"
                    />
                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            className="w-32 h-32 rounded-full mb-4 border-2 border-gray-300 shadow-sm"
                        />
                    )}
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mb-4 transition-all"
                    >
                        Save Changes
                    </button>
                </div>
                <button
                    onClick={() => router.push(`/?userId=${userId}`)}
                    className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
