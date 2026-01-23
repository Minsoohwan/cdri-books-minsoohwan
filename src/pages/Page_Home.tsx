import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { colors } from "../theme/colors"
import { fonts } from "../theme/font"
import Menu from "../common/components/Menu"
import SearchPanel from "../common/components/SearchPanel"
import Popover from "../common/components/Popover"
import SelectBox from "../common/components/SelectBox"
import { TextBox } from "../common/components/TextBox"
import { Button } from "../common/components/Button"
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
    const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set())

    const debouncedSearchValue = useDebounce(searchValue, 500)
    const {
        data: searchResult,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useBookSearchInfinite({
        query: debouncedSearchValue,
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

    const headerMenuItems = [
        { id: "search", label: "도서 검색" },
        { id: "like", label: "내가 찜한 책" },
    ]

    return (
        <PageContainer>
            <Header justifyContent="space-between" alignItems="center">
                <Logo>CERTICOS BOOKS</Logo>
                <Menu
                    items={headerMenuItems}
                    activeItemId={currentMenu}
                    onItemClick={setCurrentMenu}
                />
            </Header>
            <SearchWrapper>
                <SearchTitle>도서 검색</SearchTitle>
                <SearchPanelWrapper>
                    <SearchPanel
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        buttonConfig={{
                            text: "상세검색",
                            border: `1px solid ${colors.text.subtitle}`,
                            onClick: () => setIsDetailSearchOpen(true),
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
                {totalCount === 0 && debouncedSearchValue ? (
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
                            검색된 결과가 없습니다.
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
                                    { value: "isbn", label: "ISBN" },
                                    { value: "publisher", label: "출판사" },
                                    { value: "person", label: "저자" },
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
                                console.log("Search params:", {
                                    target: detailSearchTarget,
                                    query: detailSearchQuery,
                                })
                                setIsDetailSearchOpen(false)
                            }}
                        >
                            검색하기
                        </Button>
                    </ContentContainer>
                </DetailSearchContent>
            </Popover>
        </PageContainer>
    )
}

export default Page_Home

const PageContainer = styled(FlexColumnContainer)`
    width: 100%;
    height: 100%;
    background-color: ${colors.palette.white};
    padding: 0 24px;
`

const Header = styled(FlexRowContainer)<{
    justifyContent?: "space-between"
    alignItems?: "center"
}>`
    height: 80px;
    margin-bottom: 60px;
`

const Logo = styled.div`
    ${fonts.title1}
    color: ${colors.text.primary};
    margin: 0;
`

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
