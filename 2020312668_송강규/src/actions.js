'use server';
import db from "./db";

// --- Login & Register Part ---
// Login Function: formData를 받아서 id가 존재하고, 해당 id의 password와 동일하면 통과.
export const Login = async(formData) => {
    const userName = formData.get("userName");
    const password = formData.get("password");

    try {
        const User = await db.user.findUnique({
            where: {userName: userName}
        });
        if (!User) {
            return false;
        }
        if (User.password == password) {
            return true;
        }
        else    return false;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to login!");
    }
}

export const Register = async(formData) => {
    const userName = formData.get("userName");
    const password = formData.get("password");

    if (userName === '') {
        return -1
    } else if (password === '') {
        return -2
    }

    try {
        const User = await db.user.findUnique({
            where: {userName: userName}
        });
        // 같은 userName의 유저가 있는 경우
        if (User) {
            return 0;
        }
        else {
            const newUser = await db.user.create({
                data: {
                    userName: userName,
                    password: password,
                }
            });
            return 1;
        }
    } catch (error) {
        console.log(error);
        throw new Error("Failed to register!");
    }
}

export const getUserIdByUserName = async (userName) => {
    try {
        const User = await db.user.findUnique({
            where: {userName: userName}
        })
        if (!User) {
            return "";
        }

        const userId = User.id;
        return userId;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to get user id by user name!");
    }
}

export const getUserNameByUserId = async (userId) => {
    try {
        const User = await db.user.findUnique({
            where: {id: userId}
        })
        if (!User) {
            return "";
        }

        const userName = User.userName;
        return userName;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to get user name by user id!");
    }
}
// --- Additional Function - 2. Search
export const searchNotes = async (keyword, userId) => {
    try {
        const filter = keyword ? [{
            OR: [
                {title: {contains: keyword}},
                {contents: {
                    value: {contains: keyword}
                }},
            ],
        }] : [];
        if (keyword.length == 0) {
            return [];
        }

        const NotesFound = await db.note.findMany({
            where: {AND: [
                ...filter,
                {OR: [
                    {userId: userId},
                    {share: true},
                ]},
            ]},
            orderBy: [
                {pinned: 'desc'}, 
                {id: 'asc'}
            ],
        });

        return NotesFound;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to search!");
    }
}

// --- Additional Function - 3. Profile Image
export const updateProfileImage = async (userId, profileImg) => {
    try {
        // DB 업데이트
        await db.user.update({
            where: { id: parseInt(userId, 10) },
            data: { profileImg: Buffer.from(profileImg.split(",")[1], "base64") },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile image:", error);
        return { success: false, error: error.message };
    }
};


export const getUserByUserId = async (userId) => {
    try {
        const User = await db.user.findUnique({
            where: {id: userId}
        })

        return User;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to get user by user id!");
    }
}

// --- Additional Function - 5. Favorite and Pin
export const togglePinned = async (Note) => {
    const noteId = Note.id;
    const pinned = Note.pinned;
    try {
        await db.note.update({
            where: {id: noteId},
            data: {pinned: !pinned}
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to toggle pinned!");
    }
}

// --- Additional Function - 6. Share
export const toggleShare = async (Note) => {
    const noteId = Note.id;
    const share = Note.share;
    try {
        await db.note.update({
            where: {id: noteId},
            data: {share: !share}
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to toggle share!");
    }
}

export const getUserByNote = async (Note) => {
    try {
        const User = await db.user.findUnique({
            where: {id: Note.userId}
        })

        return User;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to get username by note!");
    }
}
// --- 기존의 HW3에 사용된 코드들 ---

// 특정 user의 문서만 가져오도록 변경
export const getNotes = async (userId) => {
    try {
        const Notes = await db.note.findMany({
            where: {OR: 
                [
                    {userId: userId},
                    {share: true},
                ]},
            orderBy: [
                {pinned: 'desc'}, 
                {id: 'asc'}
            ],
        }); 

        return Notes;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to get notes!")
    }
}

// 특정 user의 문서에 추가하도록 변경
// 제대로 작동되었다면 새로 생성된 note의 id 반환
export const createNewPage = async (userId) => {
    try {
        const newNote = await db.note.create({
            data: {
                title: "Undefined Title",
                createdAt: new Date(),
                userId: userId,
            },
        });

        await db.content.create({
            data: {
                type: "p",
                value: "",
                noteId: newNote.id,
            },
        });

        return newNote.id;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create new page!");
    }
}

export const deletePage = async (Note) => {
    try {
        await db.note.delete({
            where: { id: Note.id},
        });
        
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete a page!");
    }
}

export const changeTitle = async (currentNoteId, newTitle) => {
    try {
        await db.note.update({
            where: {id: currentNoteId},
            data: {title: newTitle}
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to change title!");
    }
}

export const changeContent = async (currentNoteId, newContent) => {
    try {
        await db.content.update({
            where: {noteId: currentNoteId},
            data: {value: newContent}
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to change title!");
    }
}

export const getTitle = async (currentNoteId) => {
    try {
        const currentNote = await db.note.findUnique({
            where: {id: currentNoteId},
        })

        return currentNote.title;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to find title!");
    }
}

export const getContent = async (currentNoteId) => {
    try {
        const currentContent = await db.content.findUnique({
            where: {noteId: currentNoteId},
        })

        return currentContent.value;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to find content!");
    }
}