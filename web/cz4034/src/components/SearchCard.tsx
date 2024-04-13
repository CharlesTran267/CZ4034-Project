import { SearchResult } from "@/types/SearchResult"
import CommentDetailModal from "./CommentDetailModal";
import { getCommentDetails } from "@/utils/utils";

export default function SearchCard({ result }: { result: SearchResult }) {
    const details = getCommentDetails(result);

    return(
        <div className="card w-[1000px] bg-base-100 shadow-xl mb-4 hover:opacity-80 hover:cursor-pointer">
            <div className="card-body p-6" onClick={()=> (document.getElementById(`comment_detail_modal_${result.comment_id}`)! as HTMLDialogElement).showModal()}>
                <div className="flex flex-grow justify-between">
                    <div className="flex">
                        <h2 className="card-title mr-2">{details.source}</h2>
                        <h3 className={`card-title text-sm ${details.polarity==="Positive"?"text-success":details.polarity==="Negative"?"text-error":"text-warning"}`}>{details.polarity}</h3>
                    </div>
                    <div className="flex">
                        {details.likes != null?<h4 className="card-title text-sm mx-2">likes: {details.likes}</h4>:null}
                        {details.timestamp != null?<h4 className="card-title text-sm">date: {details.timestamp.toLocaleDateString()}</h4>:null}
                    </div>
                </div>
                <p className="line-clamp-3 overflow-hidden text-ellipsis">{details.title!=null?(
                    <>
                        <span>Title: {details.title}</span>
                        <br/>
                        <span>{details.comment}</span>
                    </>):details.comment}</p>
                <div className="card-actions justify-end">
                </div>
            </div>
            <CommentDetailModal result={result}/>
        </div>
    )
}