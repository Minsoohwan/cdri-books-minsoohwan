import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { colors } from "../theme/colors"
import { fonts } from "../theme/font"
import { FlexColumnContainer } from "../common/style/FlexContainer"
import iconBook from "../assets/icon/iconBook.svg"
import BookList from "../common/components/BookList"
import { useState } from "react"
import PageCommon from "../common/layout/PageCommon"
import type { BookSearchResponse } from "../api/BookFetcher"

function Page_LikedBooks() {
    const [currentMenu, setCurrentMenu] = useState("like")
    const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set())
    const [likedBooksData, setLikedBooksData] = useState<
        BookSearchResponse["documents"]
    >([])

    // TODO: Mock API에서 찜한 책 데이터 로드
    // useEffect(() => {
    //     // Mock API 호출
    // }, [])

    const onToggleLike = (isbn: string) => {
        // TODO: Mock API를 통해 찜한 책 삭제
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
        <PageCommon currentMenu={currentMenu} onMenuClick={setCurrentMenu}>
            <SearchResult flex={1}>
                {likedBooks.size === 0 ? (
                    <EmptyResult
                        alignItems="center"
                        justifyContent="center"
                        gap={40}
                    >
                        <img src={iconBook} alt="empty state" />
                        <span
                            css={css`
                                ${fonts.caption}
                                color: ${colors.text.secondary};
                            `}
                        >
                            찜한 책이 없습니다.
                        </span>
                    </EmptyResult>
                ) : (
                    <BookList
                        books={likedBooksData}
                        likedBooks={likedBooks}
                        onToggleLike={onToggleLike}
                    />
                )}
            </SearchResult>
        </PageCommon>
    )
}

export default Page_LikedBooks

const SearchResult = styled(FlexColumnContainer)`
    width: 100%;
    overflow-y: auto;
`

const EmptyResult = styled(FlexColumnContainer)``
