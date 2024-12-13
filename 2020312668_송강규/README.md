# Web Programming Practice HW3
<br><br>
   
## TODO
1. ~~Make DB~~<br>
2. ~~useState -> DB fetching~~<br>
3. modify layout.js (only input page is routed)
* Canceled. Because both sidebar and main part use DB.

<br><br>   

## Structure
📦ass03  
 ┣ 📂prisma  
 ┃ ┣ 📜dev.db  
 ┃ ┗ 📜schema.prisma  
 ┣ 📂src  
 ┃ ┣ 📂app  
 ┃ ┃ ┣ 📂seed  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂ui  
 ┃ ┃ ┃ ┣ 📜Doc.js  
 ┃ ┃ ┃ ┣ 📜Main.jsx  
 ┃ ┃ ┃ ┣ 📜NewPage.js  
 ┃ ┃ ┃ ┗ 📜Sidebar.jsx  
 ┃ ┃ ┣ 📜layout.js  
 ┃ ┃ ┗ 📜page.js  
 ┃ ┣ 📜actions.js  
 ┃ ┗ 📜db.js  
 ┣ 📜.env  
 ┣ 📜package-lock.json  
 ┣ 📜package.json  
 ┣ 📜README.md  
 ┗ 📜tailwind.config.js  
   
<br><br>   

## What I learned
## 2024-11-21
1. typo issue...   

2. This is cannot be used.   
    ```javascript
    searchParams != {}
    ```   

3. `imgPath`'s root directory is "{root_directory_of_project}/public"   

    ```html
    <img src={imgPath}><img/>
    ```
4. In the react, you should use `fillRule` instead of `fill-rule`.   

    HTML component | React Component |
    ---|---|
    `fill-rule` | `fillRule`|
    `class` | `className`|   

5. How to use clsx?   

    ```jsx
    <div className={clsx(
        "class1",
        isTrue ? "class2" : "class3",
        isFalse && "class4",
        "class5"
    )}>
        Content
    <div/>
    ```
    Result: `class1` `class2` `class5`

---
 <br><br>

## 2024-11-22
1. `NaN` is not same with *any* value  
    (even itself)
    ```javascript
    NaN == NaN; // false
    ```

2. When you want to delete a data in relation with another data,<br>
    you should append `onDelete: Cascade` in relation.<br>
    ```markdown
    model Note {
    id          Int      @id @default(autoincrement())
    title       String
    createdAt   DateTime
    contents    Content? 
    }

    model Content {
    id          Int      @id @default(autoincrement())
    type        String
    value       String
    note        Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
    noteId      Int      @unique // 1:1 관계를 보장
    }
    ```
3. **Console Error**
    ```
    A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.
    ```
    **Solution**  
    Find `async/await` in the jsx file using`'use client'`!

4. When you get data from DB, you must use `await`.  
    If there is no return until then, it will return `Promise`

5. **Console Error** 
    ```
    Cannot update a component (`Router`) while rendering a different component (`Main`). To locate the bad setState() call inside `Main`, follow the stack trace as described in https://react.dev/link/setstate-in-render
    ```
    **Solution**  
    Using `async/await`, it means that it is *asyncronous*.  
    It means that it can not run immediately!!!  
    ***In other words, don't try to use `await` data immediately.***  

6. You can use `async/await` even in the client component.  
    *Only In the `useEffect` or `useState`.*

7. **Problem**
    ```jsx
    <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
    </div>
    ```
    Why it's not be center?  

    **Solution**  
    Because the parent of this `<div>` is flex, to occupy the whole part, we need to add `grow` class.  
    ```jsx
    <div className="grow flex items-center justify-center">
        <span>Loading...</span>
    </div>
    ```
<br><br>   
---
 <br><br>

## 2024-11-26
1. To check an array is empty,  
use
```jsx
array.length == 0
```
instead of  
```jsx
array == []
```
Because JS use reference comparison!

## Patch Notes
**<2024-11-21 ver.1.0>**  
- parameter name changed:<br><br>
    > `docs` -> `Notes`   
    > `docId` -> `CurrentNoteId`   
    > `doc` -> `Note`   
- `Sidebar.jsx` complete:<br><br>
    > divide the part to Doc.js & NewPage.js   
- `NewPage.js` complete:<br><br>
    > use `createNewPage` function in src/actions.js   
    > when add a new page, there is a problem:   
    > > DB is updated well, but the browser didn't render immediately.   
    > > so I add "router.refresh()" in the onClick function.   
- `Doc.js` complete:<br><br>
    > take the `Notes` as parameter of `Doc`.   
    > define `active` -> return true if this note is selected one.   
    > mark the selected note in sidebar using `clsx`.   
    > `currentNoteId` is set to searchParams's id as default.   
    > when the Note in the sidebar is clicked,   
    > * `currentNoteId` is changed to selected Note's id, when a Note is clicked,    
    > * route to `localhost:3000/?id={currentNoteId}`   
- Sidebar part is done!<br>
- Remain Part:<br><br>
    > * add delete function for each note.  
    > * construct main part  
        
---
**<2024-11-21 ver.1.5>**
- Delete Note feature added.<br>
- When delete the note already selected, the path's id is still that note's id.<br>
    > So in this case, change the path's id to first note's.  
    > ```jsx
    > e.stopPropagation();
    > deletePage(Note);
    > if (currentNoteId == Note.id) {
    >   const firstNoteId = Notes[0]?.id;
    >   if (firstNoteId) {
    >       const newSearchParams = new URLSearchParams(searchParams);
    >       newSearchParams.set('id', firstNoteId);
    >       const newPath = `/?${newSearchParams.toString()}`;
    >       router.push(newPath);
    >   }
    >   } else {
    >   router.refresh();
    >   }
    >```

---
**<2024-11-22 ver.2.0>**
- `Main.jsx` complete:<br><br>
    * there are so many problems because of `async/await`...  
    * through `useState`, make state for `loading`. But why?  
        > get title from DB asyncronously, we can not reflect DB data immediately.  
        > so we use loading page.  
        > even in the client component, we can use `async/await` in the `useEffect`.     <br>
    * through `useState`, make state for `title` & `content`.  
        > in order to reflect immediately on browser.  
        > first, reflect to browser using `title` & `content`  
        > Next, reflect it to DB. (using onChange)  
        > when the title or content change, call `router.refresh()`.  
        > > so that sidebar can reflect too.  
- `actions.js` complete:<br><br>
    > Add `getNotes()`  
    > Add `getTitle(currNoteId)`   
    > Add `getContent(currentId)`  

<br><br>   

---
**<2024-11-22 ver.2.0>**
- `Main.jsx` fixed:<br><br>
    * assume that there is no seed data initially.  
    I only add below code front of Main function
    ```jsx
        if (Notes.length == 0) {
        return (<div className="">There is no notes in DB. Please add a new note.</div>)
    }
- Bug Detection: when the first note is deleted.
- Delete function deleted.

**Taken Time: 6 hours**  
**Done at 2024-11-22**  
