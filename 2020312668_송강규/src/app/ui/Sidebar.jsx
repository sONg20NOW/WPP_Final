import Doc from "./Doc";
import NewPage from "./NewPage";

export default async function Sidebar({Notes}) {
  const imgPath = "/assets/profile.jpg";

  return (
      <div className='w-60 bg-zinc-100 p-0 flex flex-col m-0 text-zinc-900 text-xs font-bold'>
      <div className="flex justify-between my-1 py-1 px-1.5 m-2">
        <div className="flex flex-row items-center">
          <img className="rounded w-6 h-6" src={imgPath}/>
          <p className='px-2 font-semibold text-sm text-zinc-700'>WebP의 ...</p>
        </div>
        <svg role="graphics-symbol" viewBox="0 0 24 24" className="rounded w-6 h-6 h-full"><g><path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"></path></g></svg>
      </div>
      <div className='m-1 mx-2'>
        <div className="flex justify-start py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm mb-1">
          <div className="mr-1.5">
            <svg role="graphics-symbol" viewBox="0 0 20 20" className="w-5 h-5 h-full"><path fillRule="evenodd" clipRule="evenodd" d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"></path></svg>
          </div>
          Search
        </div>
        <div className="flex justify-start py-1 px-1.5 fill-zinc-500 text-zinc-500 font-bold text-sm">
          <div className="mr-1.5">
            <svg role="graphics-symbol" viewBox="0 0 20 20" className="w-5 h-5 h-full"><path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5L7.5 10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499L12.5 15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499L11 10.9999H9L9 15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z"></path></svg>
          </div>
          Home
        </div>
      </div>
      <div className="ml-2.5 text-zinc-400 mb-1">
        <p><br/><br/>Private</p>
      </div>
      <div className=''>
        {Notes.map((Note) => (
          <Doc key={Note.id} Notes={Notes} Note={Note}></Doc>
        ))}
        <NewPage></NewPage>
      </div>
    </div>
  );
}