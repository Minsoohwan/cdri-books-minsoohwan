import styled from "@emotion/styled"
import { css } from "@emotion/react"
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
import { useState } from "react"
import iconBook from "../assets/icon/iconBook.svg"
import useDebounce from "../common/hooks/useDebounce"
import { useBookSearchInfinite } from "../api/BookFetcher"
import BookList from "../common/components/BookList"
import { useEffect, useRef } from "react"

const DETAIL_SEARCH_BUTTON_ID = "detail-search-button"

function Page_Home() {
    const [currentMenu, setCurrentMenu] = useState("search")
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

    const searchResultRef = useRef<HTMLDivElement>(null)

    const allBooks = searchResult?.pages.flatMap((page) => page.documents) ?? []
    const totalCount = searchResult?.pages[0]?.meta.total_count ?? 0

    useEffect(() => {
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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <PageCommon currentMenu={currentMenu} onMenuClick={setCurrentMenu}>
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
            <SearchInfo gap={16} alignItems="center">
                <span
                    css={css`
                        ${fonts.caption}
                        color: ${colors.text.primary};
                    `}
                >
                    도서 검색 결과
                </span>
                <span
                    css={css`
                        ${fonts.caption}
                        color: ${colors.text.primary};
                    `}
                >
                    총{" "}
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
                {totalCount === 0 ? (
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
                            {searchQuery
                                ? "검색된 결과가 없습니다."
                                : "검색을 해주세요."}
                        </span>
                    </EmptyResult>
                ) : allBooks.length > 0 ? (
                    <>
                        <BookList
                            books={allBooks}
                            likedBooks={likedBooks}
                            onToggleLike={(isbn) => {
                                setLikedBooks((prev) => {
                                    const newSet = new Set(prev)
                                    if (newSet.has(isbn)) {
                                        newSet.delete(isbn)
                                    } else {
                                        newSet.add(isbn)
                                    }
                                    return newSet
                                })
                            }}
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
                ) : null}
            </SearchResult>
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
    margin: 0;
`

const SearchPanelWrapper = styled.div`
    margin-top: 16px;
`

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
