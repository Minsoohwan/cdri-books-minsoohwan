import styled from "@emotion/styled"
import { colors } from "../theme/colors"
import { fonts } from "../theme/font"
import PageCommon from "../common/layout/PageCommon"
import SearchPanel from "../common/editor/SearchPanel"
import Popover from "../common/components/Popover"
import SelectBox from "../common/editor/SelectBox"
import { TextBox } from "../common/editor/TextBox"
import { Button } from "../common/editor/Button"
import {
    FlexRowContainer,
    FlexColumnContainer,
} from "../common/style/FlexContainer"
import closeIcon from "../assets/icon/close.svg"
import { useState, useEffect } from "react"
import useDebounce from "../common/hooks/useDebounce"
import { useBookSearchInfinite } from "../api/BookFetcher"
import SearchResultSection from "../common/components/SearchResultSection"
import {
    getLikedBooks,
    addLikedBook,
    removeLikedBook,
} from "../api/mock/likedBooksApi"
import { addSearchHistory } from "../api/mock/searchHistoryApi"

const DETAIL_SEARCH_BUTTON_ID = "detail-search-button"

function Page_Home() {
    const [searchValue, setSearchValue] = useState("")
    const [isDetailSearchOpen, setIsDetailSearchOpen] = useState(false)
    const [detailSearchTarget, setDetailSearchTarget] = useState("title")
    const [detailSearchQuery, setDetailSearchQuery] = useState("")
    const [isDetailSearchMode, setIsDetailSearchMode] = useState(false)
    const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set())

    const debouncedSearchValue = useDebounce(searchValue, 300)
    const debouncedDetailSearchQuery = useDebounce(detailSearchQuery, 300)

    const searchQuery = isDetailSearchMode
        ? debouncedDetailSearchQuery
        : debouncedSearchValue

    const searchTarget = isDetailSearchMode
        ? (detailSearchTarget as "title" | "publisher" | "person")
        : undefined

    const {
        data: searchResult,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useBookSearchInfinite({
        query: searchQuery,
        target: searchTarget,
        size: 10,
    })

    const allBooks = searchResult?.pages.flatMap((page) => page.documents) ?? []
    const totalCount = searchResult?.pages[0]?.meta.total_count ?? 0

    useEffect(() => {
        getLikedBooks().then((data) => {
            setLikedBooks(new Set(data.isbns))
        })
    }, [])

    useEffect(() => {
        if (
            searchQuery &&
            searchResult &&
            searchResult.pages.length > 0 &&
            !isFetchingNextPage
        ) {
            const currentPage =
                searchResult.pages[searchResult.pages.length - 1]
            if (currentPage && currentPage.documents.length > 0) {
                addSearchHistory(
                    searchQuery,
                    searchTarget,
                    currentPage.documents,
                    currentPage.meta.total_count
                )
            }
        }
    }, [searchQuery, searchTarget, searchResult, isFetchingNextPage])

    return (
        <PageCommon>
            <SearchWrapper>
                <SearchTitle>도서 검색</SearchTitle>
                <SearchPanelWrapper>
                    <SearchPanel
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                            setIsDetailSearchMode(false)
                            setDetailSearchQuery("")
                        }}
                        buttonConfig={{
                            text: "상세검색",
                            border: `1px solid ${colors.text.subtitle}`,
                            onClick: () => {
                                setIsDetailSearchOpen(true)
                            },
                        }}
                        buttonId={DETAIL_SEARCH_BUTTON_ID}
                        gap={12}
                    />
                </SearchPanelWrapper>
            </SearchWrapper>
            <SearchResultSection
                type="search"
                totalCount={totalCount}
                searchQuery={searchQuery}
                allBooks={allBooks}
                likedBooks={likedBooks}
                onToggleLike={async (isbn) => {
                    const book = allBooks.find((b) => b.isbn === isbn)
                    if (book) {
                        const isCurrentlyLiked = likedBooks.has(isbn)
                        if (isCurrentlyLiked) {
                            await removeLikedBook(isbn)
                        } else {
                            await addLikedBook(book)
                        }
                        setLikedBooks((prev) => {
                            const newSet = new Set(prev)
                            if (isCurrentlyLiked) {
                                newSet.delete(isbn)
                            } else {
                                newSet.add(isbn)
                            }
                            return newSet
                        })
                    }
                }}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
            <Popover
                isOpen={isDetailSearchOpen}
                onClose={() => setIsDetailSearchOpen(false)}
                target={`#${DETAIL_SEARCH_BUTTON_ID}`}
                position={{ target: "bottom", align: "start" }}
                closeOnOutsideClick={true}
            >
                <DetailSearchContent>
                    <CloseButton onClick={() => setIsDetailSearchOpen(false)}>
                        <CloseIcon src={closeIcon} alt="close" />
                    </CloseButton>
                    <ContentContainer gap={24}>
                        <SearchRow gap={16} alignItems="flex-end">
                            <SelectBox
                                width={120}
                                label="제목"
                                value={detailSearchTarget}
                                onChange={(value) =>
                                    setDetailSearchTarget(value)
                                }
                                options={[
                                    { value: "title", label: "제목" },
                                    { value: "publisher", label: "출판사" },
                                    { value: "person", label: "저자명" },
                                ]}
                            />
                            <TextBox
                                width="100%"
                                placeholder="검색어 입력"
                                value={detailSearchQuery}
                                onChange={(e) =>
                                    setDetailSearchQuery(e.target.value)
                                }
                            />
                        </SearchRow>
                        <Button
                            width="100%"
                            height={40}
                            backgroundColor="primary"
                            onClick={() => {
                                setIsDetailSearchMode(true)
                                setSearchValue("")
                                setIsDetailSearchOpen(false)
                            }}
                        >
                            검색하기
                        </Button>
                    </ContentContainer>
                </DetailSearchContent>
            </Popover>
        </PageCommon>
    )
}

export default Page_Home

const SearchWrapper = styled(FlexColumnContainer)`
    width: 100%;
`

const SearchTitle = styled.div`
    ${fonts.title3}
    color: ${colors.text.primary};
`

const SearchPanelWrapper = styled.div`
    margin-top: 16px;
`

const DetailSearchContent = styled.div`
    position: relative;
    width: 480px;
    padding: 24px;
`

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;

    padding: 4px;
    border: none;
    background: none;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`

const CloseIcon = styled.img`
    width: 12px;
    height: 12px;
`

const ContentContainer = styled(FlexColumnContainer)`
    width: 100%;
`

const SearchRow = styled(FlexRowContainer)`
    width: 100%;
`
