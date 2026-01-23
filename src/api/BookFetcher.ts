import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const KAKAO_API_BASE_URL = "https://dapi.kakao.com/v3/search/book"

export interface BookSearchParams {
    query: string // 필수
    sort?: "accuracy" | "latest" | "publish_time"
    page?: number
    size?: number
    target?: "title" | "isbn" | "publisher" | "person"
}

export interface BookSearchResponse {
    meta: {
        total_count: number
        pageable_count: number
        is_end: boolean
    }
    documents: Array<{
        title: string
        contents: string
        url: string
        isbn: string
        datetime: string
        authors: string[]
        publisher: string
        translators: string[]
        price: number
        sale_price: number
        thumbnail: string
        status: string
    }>
}

export async function searchBooks(
    params: BookSearchParams
): Promise<BookSearchResponse> {
    const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY

    if (!apiKey) {
        console.error("KAKAO_REST_API_KEY is required")
    }

    const response = await axios.get<BookSearchResponse>(KAKAO_API_BASE_URL, {
        headers: {
            Authorization: `KakaoAK ${apiKey}`,
        },
        params: {
            query: params.query,
            ...(params.sort && { sort: params.sort }),
            ...(params.page && { page: params.page }),
            ...(params.size && { size: params.size }),
            ...(params.target && { target: params.target }),
        },
    })

    return response.data
}

export function useBookSearch(params: BookSearchParams) {
    return useQuery({
        queryKey: ["bookSearch", params],
        queryFn: () => searchBooks(params),
        enabled: !!params.query,
    })
}
