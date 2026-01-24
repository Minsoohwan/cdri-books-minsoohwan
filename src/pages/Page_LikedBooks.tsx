import { useState, useEffect } from "react"
import PageCommon from "../common/layout/PageCommon"
import SearchResultSection from "../common/components/SearchResultSection"
import type { BookSearchResponse } from "../api/BookFetcher"
import styled from "@emotion/styled"
import { fonts } from "../theme/font"
import { colors } from "../theme/colors"
import { getLikedBooks, removeLikedBook } from "../api/mock/likedBooksApi"

function Page_LikedBooks() {
    const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set())
    const [likedBooksData, setLikedBooksData] = useState<
        BookSearchResponse["documents"]
    >([])

    useEffect(() => {
        getLikedBooks().then((data) => {
            setLikedBooks(new Set(data.isbns))
            setLikedBooksData(data.books)
        })
    }, [])

    const onToggleLike = async (isbn: string) => {
        await removeLikedBook(isbn)
        setLikedBooks((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(isbn)) {
                newSet.delete(isbn)
                setLikedBooksData((prevData) =>
                    prevData.filter((book) => book.isbn !== isbn)
                )
            }
            return newSet
        })
    }

    return (
        <PageCommon>
            <Title>내가 찜한 책</Title>
            <SearchResultSection
                type="like"
                totalCount={likedBooksData.length}
                allBooks={likedBooksData}
                likedBooks={likedBooks}
                onToggleLike={onToggleLike}
            />
        </PageCommon>
    )
}

export default Page_LikedBooks

const Title = styled.div`
    ${fonts.title3}
    color: ${colors.text.primary};
`
