'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchText, setSearchText] = useState<string | null>();
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }
  const router = useRouter();
  const handleSubmitSearch = () => {
    router.push(`/search?query=${searchText}`);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmitSearch();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [searchText]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h1 className="m-6 text-6xl font-bold text-primary">App Name</h1>
        <h1 className="text-3xl font-bold text-neutral">
          App short introduction go here
        </h1>
      </div>
      <div className="mx-auto my-12 flex w-[600px] flex-col gap-2 transition-all">
      <label className="input input-bordered flex items-center gap-2 h-15">
        <input type="text" className="grow text-lg" placeholder="Search" onChange={handleSearchTextChange}/>
        <button className="btn btn-ghost m-0 p-0" onClick={handleSubmitSearch}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        </button>
      </label>
      </div>
    </div>
  );
}
