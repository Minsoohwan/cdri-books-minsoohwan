import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { colors } from "../theme/colors"
import { fonts } from "../theme/font"
import Menu from "../common/components/Menu"
import SearchPanel from "../common/components/SearchPanel"
import { useState } from "react"
import iconBook from "../assets/icon/iconBook.svg"
import {
    FlexRowContainer,
    FlexColumnContainer,
} from "../common/style/FlexContainer"

function Page_Home() {
    const [headerMenuActive, setHeaderMenuActive] = useState("all")
    const [searchValue, setSearchValue] = useState("")
    const [totalCount] = useState(0)

    const headerMenuItems = [
        { id: "all", label: "전체 도서" },
        { id: "library", label: "내 서재" },
        { id: "read", label: "내가 읽은 책" },
    ]

    return (
        <PageContainer>
            <Header justifyContent="space-between" alignItems="center">
                <Logo>CERTICOS BOOKS</Logo>
                <Menu
                    items={headerMenuItems}
                    activeItemId={headerMenuActive}
                    onItemClick={setHeaderMenuActive}
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
                        }}
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
            <SearchResult justifyContent="center" alignItems="center" flex={1}>
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
                            검색된 결과가 없습니다.
                        </span>
                    </EmptyResult>
                ) : (
                    <span>검색된 결과가 있습니다.</span>
                )}
            </SearchResult>
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

const Logo = styled.h1`
    ${fonts.title1}
    color: ${colors.text.primary};
    margin: 0;
`

const SearchWrapper = styled(FlexColumnContainer)`
    width: 100%;
`

const SearchTitle = styled.h2`
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

const SearchResult = styled(FlexRowContainer)`
    width: 100%;
`
const EmptyResult = styled(FlexColumnContainer)``
