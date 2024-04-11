export type SearchResult = {
    comment_id: string,
    source: string,
    brand: string,
    comment: string,
    likes: number | null,
    timestamp: string | null,
    additional_info: object,
    score: number | null,
    subjectivity: boolean | null,
    polarity: boolean | null,
}