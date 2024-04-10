'use client';
import { useParams, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { fixJsonLikeString } from "@/utils/utils";
import SearchCard from "@/components/SearchCard";
import { SearchResult } from "@/types/SearchResult";
import { useRouter } from "next/navigation";

export default  function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const [search, setSearch] = useState<string>(query);
    const [results, setResults] = useState<SearchResult[] | null>(null);

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
            
    const [loading, setLoading] = useState(false);
    const backend_url = process.env.NEXT_PUBLIC_API_URL;
    const handleSubmitSearch = async() => {
        router.push(`/search?query=${search}`);
    }

    const handleGetSearchResults = async() => {
        setLoading(true);
        setResults(null);
        setPage(1);
        if (!search) return;
        const response = await axios.get(`${backend_url}/search`,
            {
                params: {
                    query: search,
                    rows: 100,
                    ranked: true,
                }
            }
        )
        let newResults: SearchResult[] = [];
        response.data.map((result: any) => {
            let source = result.source[0];
            if (source.includes('youtube')){
                console.log(source);
                source = 'Youtube';
            }
            let newResult: SearchResult = {
                comment_id: result.comment_id[0],
                source: source,
                brand: result.brand?result.brand[0]:'',
                comment: result.comment[0],
                likes: result.likes[0],
                timestamp: result.timestamp?result.timestamp[0]:null,
                rank_score: result.rank_score,
                additional_info: {},
            }
            try{
                const additional_info = JSON.parse(fixJsonLikeString(result.additional_info[0]));
                newResult.additional_info = additional_info;
            }catch(e){
                console.log(e);
                console.log(fixJsonLikeString(result.additional_info[0]));
            }
            newResults.push(newResult);
        })
        setResults(newResults);
        setLoading(false);
    }

    useEffect(() => {
        if (query){
            handleGetSearchResults();
        }
    }, [query]);

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
    const pageSize = 4;
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [currentPageResults, setCurrentPageResults] = useState<SearchResult[]>([]);



    useEffect(() => {
        if (!results) return;
        setMaxPage(Math.ceil(results.length / pageSize));
        setCurrentPageResults(results.slice((page - 1) * pageSize, page * pageSize));
    }, [results, page]);

    const [curMinPage, setCurMinPage] = useState(1);
    const maxDisplayPage = 10;

    useEffect(() => {
        const curMaxPage = curMinPage + maxDisplayPage - 1;
        if (curMaxPage > maxPage){
            setCurMinPage((maxPage - maxDisplayPage + 1)>1?(maxPage - maxDisplayPage + 1):1);
        }

        if (page < curMinPage){
            setCurMinPage((page - maxDisplayPage + 1)>1?(page - maxDisplayPage + 1):1);
        }else if (page > curMaxPage){
            if (page + maxDisplayPage > maxPage){
                setCurMinPage((maxPage - maxDisplayPage + 1)>1?(maxPage - maxDisplayPage + 1):1);
            }else{
                setCurMinPage(page);
            }
        }
    },[page])


    return (
        <div className="flex flex-1 flex-col items-center">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
                <h1 className="m-6 mt-4 text-4xl font-bold text-primary">App Name</h1>
            </div>
            <div className="my-2 flex w-[800px] flex-col gap-2 transition-all">
                <label className="input input-bordered flex items-center gap-2 h-15">
                    <input type="text" className="grow text-lg" placeholder="Search" onChange={handleSearchTextChange} value={search}/>
                    <button className="btn btn-ghost m-0 p-0" onClick={handleSubmitSearch}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                    </button>
                </label>
                <div className="flex">
                    {results?<h2 className="mr-auto mt-2">There are {results.length} results</h2>:null}
                    <div className="ml-auto">
                        <button className="btn btn-ghost p-0 mr-4">Filter</button>
                        <button className="btn btn-ghost p-0">Sort By</button>
                    </div>
                </div>
            </div>
            {loading?<span className="loading loading-spinner loading-lg"></span>:
            (
                <>
                    <div className="flex flex-grow flex-col t-6 max-w-[1000px]">
                        {currentPageResults.map((result) => (
                            <SearchCard result={result}/>
                        ))}
                    </div>
                    <div className="join mt-auto mb-2">
                        <button className="join-item btn" onClick={()=> setPage(1)}>First</button>
                        <button className="join-item btn" onClick={()=> page-1<1?setPage(1):setPage(page-1)}>«</button>
                        {Array.from({ length: maxPage-curMinPage+1>maxDisplayPage?maxDisplayPage:maxPage-curMinPage+1 }, (_, i) => curMinPage + i).map(
                        (page_num) => (
                            <input
                            className="btn btn-square join-item"
                            type="radio"
                            name="options"
                            aria-label={`${page_num}`}
                            checked={page_num == page}
                            onClick={() => setPage(page_num)}
                            />
                        ),
                        )}
                        <button className="join-item btn" onClick={()=>page+1>maxPage?setPage(maxPage):setPage(page+1)}>»</button>
                        <button className="join-item btn" onClick={()=> setPage(maxPage)}>Last</button>
                    </div>
                </>
            )}
        </div>
    );
}