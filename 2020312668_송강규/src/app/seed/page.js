import db from "@/db";
import { redirect } from "next/navigation";

export default async function SeedPage() {
  // Only allow seeding in development or staging environments
  if (process.env.NODE_ENV === "production") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>This page is not available in the production environment.</p>
      </div>
    );
  }

  try {
    // Delete all existing todos
    await db.content.deleteMany();
    await db.note.deleteMany();

    // Create two Note
    const Note1 = await db.note.create({
        data: {
            title: "First Note",
            createdAt: new Date("2024-11-03T00:00:00Z"),
        },
    });

    const Note2 = await db.note.create({
        data: {
            title: "Second Note",
            createdAt: new Date("2024-12-05T00:00:00Z"),
        },
    });

    // Create Content for each Note
    await db.content.create({
        data: {
            type: "p",
            value: "this is first note's content!",
            noteId: Note1.id,
        },
    });

    await db.content.create({
        data: {
            type: "p",
            value: "this is second note's content!!!",
            noteId: Note2.id,
        },
    });

    // Optionally, redirect to the homepage or display a success message
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Database Seeded Successfully!</h1>
        <p>
          All existing todos have been deleted and new entries have been added.
        </p>
        <a href="/">Go to Home</a>
      </div>
    );
  } catch (error) {
    console.error("Seeding Error:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h1>Seeding Failed</h1>
        <p>There was an error seeding the database.</p>
        <pre>{error.message}</pre>
      </div>
    );
  } finally {
    // redirect("/");
  }
}
