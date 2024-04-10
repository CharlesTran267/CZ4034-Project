import { SearchResult } from "@/types/SearchResult"
import CommentDetailModal from "./CommentDetailModal";
import { getCommentDetails } from "@/utils/utils";

export default function SearchCard({ result }: { result: SearchResult }) {
    const details = getCommentDetails(result);

    return(
        <div className="card w-[1000px] bg-base-100 shadow-xl mb-4 hover:opacity-80 hover:cursor-pointer">
            <div className="card-body p-6" onClick={()=> (document.getElementById(`comment_detail_modal_${result.comment_id}`)! as HTMLDialogElement).showModal()}>
                <div className="flex flex-grow justify-between">
                    <h2 className="card-title">{details.source}</h2>
                    <div className="flex">
                        {details.likes != null?<h4 className="card-title text-sm mx-2">likes: {details.likes}</h4>:null}
                        {details.timestamp != null?<h4 className="card-title text-sm">date: {details.timestamp.toLocaleDateString()}</h4>:null}
                    </div>
                </div>
                <p className="line-clamp-3 overflow-hidden text-ellipsis">{details.comment}</p>
                <div className="card-actions justify-end">
                </div>
            </div>
            <CommentDetailModal result={result}/>
        </div>
    )
}