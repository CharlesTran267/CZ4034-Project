import { SearchResult } from "@/types/SearchResult";
import { capitalizeFirstLetter, getCommentDetails } from "@/utils/utils";

export default function CommentDetailModal({result} : {result: SearchResult}) {
    const details = getCommentDetails(result);
    return (
        <dialog id={`comment_detail_modal_${result.comment_id}`} className="modal">
            <div className="modal-box max-w-[800px] max-h-[800px] overflow-auto">
                <h3 className="font-bold text-lg mb-2">Comment Details</h3>
                {Object.entries(details).map(([key, value]) => {
                    if (value == null) return null;
                    return (
                        <p className="my-2"><span className="font-black mr-2">{capitalizeFirstLetter(key)}:</span> {value!=null?value.toString():''}</p>
                    )
                })}
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
        </dialog>
    )
}
