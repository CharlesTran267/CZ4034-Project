import { SearchResult } from "@/types/SearchResult"

export default function SearchCard({ result }: { result: SearchResult }) {
    return(
        <div className="card w-auto bg-base-100 shadow-xl mb-4">
            <div className="card-body p-6">
                <h2 className="card-title">{result.source}</h2>
                <p className="line-clamp-3 overflow-hidden text-ellipsis">{result.comment}</p>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
    )
}