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

    const handleGetSearchResults = async(params: object) => {
        setLoading(true);
        setResults(null);
        setPage(1);
        setSources(source_list);
        setBrand('');
        setStartDate('');
        setEndDate('');
        if (!search) return;
        const response = await axios.get(`${backend_url}/search`,
            {
                params: params
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
                comment_id: result.comment_id,
                source: source,
                brand: result.brand?result.brand[0]:'',
                comment: result.comment[0],
                likes: result.likes,
                timestamp: result.timestamp?result.timestamp:null,
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

    const handleSortBy = (sortBy: string) => {
        let params: { query: string; rows: number; sort_field?: string; sort_order?: string } = {
            query: query,
            rows: 50000
        }
        if (sortBy === 'Most Liked'){
            params = {
                ...params,
                sort_field: 'likes',
                sort_order: 'desc'
            }
        }else if (sortBy === 'Latest Post'){
            params = {
                ...params,
                sort_field: 'timestamp',
                sort_order: 'desc'
            }
        }else if (sortBy === 'Oldest Post'){
            params = {
                ...params,
                sort_field: 'timestamp',
                sort_order: 'asc'
            }
        }
        handleGetSearchResults(params);
    }

    const source_list = ['Reddit', 'Instagram', 'Twitter', 'TikTok', 'Youtube'];

    const [brand, setBrand] = useState<string>('');
    const [sources, setSources] = useState<string[]>(source_list);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        let params: {query: string; rows: number; brand?: string; sources?: string[]; start_date?: string; end_date?: string} = {
            query: query,
            rows: 50000,
        }

        if (brand !== '' && brand !== null){
            params = {
                ...params,
                brand: brand
            }
        }
        if (sources && sources.length > 0){
            params = {
                ...params,
                sources: sources
            }
        }

        if (startDate !=='' && startDate!==null && endDate!=='' && endDate!==null){
            params = {
                ...params,
                start_date: startDate,
                end_date: endDate
            }
        }
        
        handleGetSearchResults(params);
    }

    useEffect(() => {
        if (query){
            const params = {
                query: query,
                rows: 50000
            }
            handleGetSearchResults(params);
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

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>, source: string) => {
        if (e.target.checked){
            setSources([...sources, source]);
        }else{
            setSources(sources.filter((s) => s !== source));
        }
    }

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
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost p-0 mr-4">Filter</div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-40">
                                <li>
                                    <details open>
                                    <summary>Brand</summary>
                                    <ul>
                                        <li>
                                            <input type="text" placeholder="Brand" className="input w-full h-10 max-w-xs" value={brand} onChange={(e)=>setBrand(e.target.value)}/>
                                        </li>
                                    </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open>
                                    <summary>Source</summary>
                                    <ul>
                                        {source_list.map((source) => (
                                            <li>
                                                <div className="form-control p-0 m-0 flex">
                                                    <label className="label cursor-pointer w-full">
                                                        <span className="label-text mr-2">{source}</span> 
                                                        <input type="checkbox" defaultChecked className="checkbox" checked={sources.includes(source)} onChange={(e)=>handleSourceChange(e, source)}/>
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open>
                                    <summary>Date (DD/MM/YYYY)</summary>
                                    <ul>
                                        <li>
                                            <input type="text" placeholder="Start" className="input w-full h-10 max-w-xs" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                                            <input type="text" placeholder="End" className="input w-full h-10 max-w-xs" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                                        </li>
                                    </ul>
                                    </details>
                                </li>
                                <li className="mt-4">
                                    <button className="btn btn-primary p-0" onClick={handleFilter}>Filter</button>
                                </li>
                            </ul>
                        </div>
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="btn btn-ghost p-0">Sort By</div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-40">
                                <li onClick={()=>handleSortBy('Rank Score')}><a>Rank Score</a></li>
                                <li onClick={()=>handleSortBy('Most Liked')}><a>Most Liked</a></li>
                                <li onClick={()=>handleSortBy('Latest Post')}><a>Latest Post</a></li>
                                <li onClick={()=>handleSortBy('Oldest Post')}><a>Oldest Post</a></li>
                            </ul>
                        </div>
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