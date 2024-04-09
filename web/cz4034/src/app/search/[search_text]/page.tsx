'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default  function SearchPage() {
    const search_text = useParams().search_text;
    const [search, setSearch] = useState<any>(search_text);

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    
    const handleSubmitSearch = () => {
        console.log(search);
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
    }, [search]);

    //handle pagination


    return (
        <div className="flex flex-1 flex-col items-center">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
                <h1 className="m-6 text-4xl font-bold text-primary">App Name</h1>
            </div>
            <div className="my-2 flex w-[800px] flex-col gap-2 transition-all">
                <label className="input input-bordered flex items-center gap-2 h-15">
                    <input type="text" className="grow text-lg" placeholder="Search" onChange={handleSearchTextChange} value={search}/>
                    <button className="btn btn-ghost m-0 p-0" onClick={handleSubmitSearch}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                    </button>
                </label>
                <div className="flex">
                    <h2 className="mr-auto mt-2">There are x results</h2>
                    <button className="btn btn-ghost p-0 mr-4">Filter</button>
                    <button className="btn btn-ghost p-0">Sort By</button>
                </div>
            </div>
            <div className="mt-6 max-w-[1000px]">
                {Array(4).fill(0).map((_, i) => (
                    <div className="card w-auto bg-base-100 shadow-xl mb-4">
                     <div className="card-body">
                         <h2 className="card-title">Test</h2>
                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                         <div className="card-actions justify-end">
                         </div>
                     </div>
                    </div>
                ))}
            </div>
            <div className="join mt-auto mb-4">
                {Array(10).fill(0).map((_, i) => (
                    <input key={i} className="join-item btn btn-square" type="radio" name="options" aria-label={`${i+1}`} />
                ))}
            </div>
        </div>
    );
}