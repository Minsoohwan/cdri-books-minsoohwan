import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"
import iconBook from "../../assets/icon/iconBook.svg"
import BookList from "./BookList"
import { useRef, useEffect } from "react"
import type { BookSearchResponse } from "../../api/BookFetcher"

type SearchResultType = "search" | "like"

interface SearchResultSectionProps {
    type: SearchResultType
    totalCount?: number
    searchQuery?: string
    allBooks?: BookSearchResponse["documents"]
    likedBooks?: Set<string>
    onToggleLike?: (isbn: string) => void
    hasNextPage?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
}

function SearchResultSection({
    type,
    totalCount = 0,
    searchQuery = "",
    allBooks = [],
    likedBooks = new Set(),
    onToggleLike,
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
}: SearchResultSectionProps) {
    const searchResultRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (type !== "search" || !fetchNextPage) return

        const handleScroll = () => {
            if (!searchResultRef.current) return

            const { scrollTop, scrollHeight, clientHeight } =
                searchResultRef.current

            if (
                scrollHeight - scrollTop - clientHeight < 200 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage()
            }
        }

        const scrollElement = searchResultRef.current
        if (scrollElement) {
            scrollElement.addEventListener("scroll", handleScroll)
            return () => {
                scrollElement.removeEventListener("scroll", handleScroll)
            }
        }
    }, [type, hasNextPage, isFetchingNextPage, fetchNextPage])

    const isEmpty = type === "search" ? totalCount === 0 : likedBooks.size === 0
    const emptyMessage =
        type === "search"
            ? searchQuery
                ? "검색된 결과가 없습니다."
                : "검색을 해주세요."
            : "찜한 책이 없습니다."

    return (
        <>
            <SearchInfo gap={16} alignItems="center">
                <span
                    css={css`
                        ${fonts.caption}
                        color: ${colors.text.primary};
                    `}
                >
                    {type === "like" ? "찜한 책" : "도서 검색 결과"}
                </span>
                <span
                    css={css`
                        ${fonts.caption}
                        color: ${colors.text.primary};
                    `}
                >
                    총
                    <span
                        css={css`
                            color: ${colors.palette.primary};
                        `}
                    >
                        {totalCount}
                    </span>
                    건
                </span>
            </SearchInfo>
            <SearchResult ref={searchResultRef} flex={1}>
                {isEmpty ? (
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
                            {emptyMessage}
                        </span>
                    </EmptyResult>
                ) : type === "search" && allBooks.length > 0 ? (
                    <>
                        <BookList
                            books={allBooks}
                            likedBooks={likedBooks}
                            onToggleLike={onToggleLike || (() => {})}
                        />
                        {isFetchingNextPage && (
                            <LoadingText
                                css={css`
                                    ${fonts.caption}
                                    color: ${colors.text.secondary};
                                    text-align: center;
                                    padding: 20px;
                                `}
                            >
                                로딩 중...
                            </LoadingText>
                        )}
                    </>
                ) : type === "like" && allBooks.length > 0 ? (
                    <BookList
                        books={allBooks}
                        likedBooks={likedBooks}
                        onToggleLike={onToggleLike || (() => {})}
                    />
                ) : null}
            </SearchResult>
        </>
    )
}

export default SearchResultSection

const SearchInfo = styled(FlexRowContainer)`
    margin-top: 24px;
    margin-bottom: 36px;
`

const SearchResult = styled(FlexColumnContainer)`
    width: 100%;
    overflow-y: auto;
`

const EmptyResult = styled(FlexColumnContainer)``

const LoadingText = styled.div``
