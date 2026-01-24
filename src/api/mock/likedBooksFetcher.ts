import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BookSearchResponse } from "../BookFetcher"

export type BookData = BookSearchResponse["documents"][number]

const JSON_FILE_PATH = "/mock/liked.json"
const API_BASE_URL = "/api/mock"

export interface LikedBooksData {
    isbns: string[]
    books: BookData[]
}

const LIKED_BOOKS_QUERY_KEY = ["likedBooks"]

/**
 * 찜한 도서 목록 조회
 */
export async function getLikedBooks(): Promise<LikedBooksData> {
    try {
        const response = await axios.get<LikedBooksData>(JSON_FILE_PATH)
        return response.data
    } catch (e) {
        console.error("Failed to load liked books from JSON", e)
        return { isbns: [], books: [] }
    }
}

/**
 * 찜한 도서 추가
 */
export async function addLikedBook(book: BookData): Promise<void> {
    const data = await getLikedBooks()

    if (!data.isbns.includes(book.isbn)) {
        data.isbns.push(book.isbn)
        data.books.push(book)

        await axios.put(`${API_BASE_URL}/liked`, data)
    }
}

/**
 * 찜한 도서 삭제
 */
export async function removeLikedBook(isbn: string): Promise<void> {
    const data = await getLikedBooks()

    data.isbns = data.isbns.filter((id) => id !== isbn)
    data.books = data.books.filter((book) => book.isbn !== isbn)

    await axios.put(`${API_BASE_URL}/liked`, data)
}

export function useLikedBooks() {
    return useQuery<LikedBooksData>({
        queryKey: LIKED_BOOKS_QUERY_KEY,
        queryFn: getLikedBooks,
    })
}

export function useAddLikedBook() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (book: BookData) => addLikedBook(book),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: LIKED_BOOKS_QUERY_KEY,
            })
        },
    })
}

export function useRemoveLikedBook() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (isbn: string) => removeLikedBook(isbn),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: LIKED_BOOKS_QUERY_KEY,
            })
        },
    })
}
