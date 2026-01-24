import axios from "axios"
import type { BookSearchResponse } from "../BookFetcher"

const JSON_FILE_PATH = "/mock/searchHistory.json"
const API_BASE_URL = "/api/mock"

export interface SearchHistoryItem {
    query: string
    target?: string
    timestamp: number
    results: BookSearchResponse["documents"]
    totalCount: number
}

export interface SearchHistoryData {
    items: SearchHistoryItem[]
}

/**
 * 검색 리스트 조회
 */
export async function getSearchHistory(): Promise<SearchHistoryData> {
    try {
        const response = await axios.get<SearchHistoryData>(JSON_FILE_PATH)
        return response.data
    } catch (e) {
        console.error("Failed to load search history from JSON", e)
        return { items: [] }
    }
}

/**
 * 검색 리스트에 추가
 */
export async function addSearchHistory(
    query: string,
    target: string | undefined,
    results: BookSearchResponse["documents"],
    totalCount: number
): Promise<void> {
    const data = await getSearchHistory()

    const newItem: SearchHistoryItem = {
        query,
        target,
        timestamp: Date.now(),
        results,
        totalCount,
    }

    data.items = data.items.filter(
        (item) => !(item.query === query && item.target === target)
    )

    data.items.unshift(newItem)

    if (data.items.length > 8) {
        data.items = data.items.slice(0, 8)
    }

    await axios.put(`${API_BASE_URL}/searchHistory`, data)
}

/**
 * 검색 리스트에서 삭제
 */
export async function removeSearchHistory(timestamp: number): Promise<void> {
    const data = await getSearchHistory()

    data.items = data.items.filter((item) => item.timestamp !== timestamp)

    await axios.put(`${API_BASE_URL}/searchHistory`, data)
}
