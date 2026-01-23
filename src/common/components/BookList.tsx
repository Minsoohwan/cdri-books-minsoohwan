import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import { Button } from "./Button"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"
import chevronIcon from "../../assets/icon/chevron.svg"
import heartFillIcon from "../../assets/icon/heart_fill.svg"
import heartStrokeIcon from "../../assets/icon/heart_stroke.svg"
import { useState } from "react"
import type { BookSearchResponse } from "../../api/BookFetcher"

interface BookListProps {
    books: BookSearchResponse["documents"]
    likedBooks: Set<string>
    onToggleLike: (isbn: string) => void
}

function BookList({ books, likedBooks, onToggleLike }: BookListProps) {
    const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set())

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR").format(price)
    }

    const onToggleDetail = (isbn: string) => {
        setExpandedBooks((prev) => {
            const result = new Set(prev)
            if (result.has(isbn)) {
                result.delete(isbn)
            } else {
                result.add(isbn)
            }
            return result
        })
    }

    return (
        <BookListContainer>
            {books.map((book, index) => {
                const isLiked = likedBooks.has(book.isbn)
                const isExpanded = expandedBooks.has(book.isbn)
                return (
                    <BookItemWrapper key={book.isbn || index}>
                        <ListItem alignItems="center">
                            <ThumbnailWrapper>
                                <BookThumbnail src={book.thumbnail} />
                                <HeartButton
                                    onClick={() => onToggleLike(book.isbn)}
                                    type="button"
                                >
                                    <HeartIcon
                                        src={
                                            isLiked
                                                ? heartFillIcon
                                                : heartStrokeIcon
                                        }
                                        alt={isLiked ? "좋아요 취소" : "좋아요"}
                                        width={13}
                                        height={12}
                                    />
                                </HeartButton>
                            </ThumbnailWrapper>
                            <BookInfo
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <TitleAuthorContainer>
                                    <BookTitle>{book.title}</BookTitle>
                                    <BookAuthor>
                                        {book.authors.join(", ")}
                                    </BookAuthor>
                                </TitleAuthorContainer>
                                <FlexRowContainer alignItems="center">
                                    <BookPrice>
                                        {formatPrice(book.price)}원
                                    </BookPrice>
                                    <FlexRowContainer
                                        gap={8}
                                        alignItems="center"
                                    >
                                        <Button
                                            width={80}
                                            height={36}
                                            backgroundColor="primary"
                                            onClick={() => {
                                                window.open(book.url, "_blank")
                                            }}
                                        >
                                            구매하기
                                        </Button>
                                        <Button
                                            width={90}
                                            height={36}
                                            backgroundColor="lightGray"
                                            textColor="primary"
                                            onClick={() =>
                                                onToggleDetail(book.isbn)
                                            }
                                        >
                                            상세보기
                                            <ChevronIcon
                                                src={chevronIcon}
                                                alt=""
                                                isExpanded={isExpanded}
                                            />
                                        </Button>
                                    </FlexRowContainer>
                                </FlexRowContainer>
                            </BookInfo>
                        </ListItem>
                        <DetailWrapper isExpanded={isExpanded}>
                            <DetailContent>
                                <DetailThumbnailWrapper>
                                    <DetailThumbnail
                                        src={book.thumbnail}
                                        alt={book.title}
                                    />
                                    <DetailHeartButton
                                        onClick={() => onToggleLike(book.isbn)}
                                        type="button"
                                    >
                                        <HeartIcon
                                            src={
                                                isLiked
                                                    ? heartFillIcon
                                                    : heartStrokeIcon
                                            }
                                            alt={
                                                isLiked
                                                    ? "좋아요 취소"
                                                    : "좋아요"
                                            }
                                            width={24}
                                            height={24}
                                        />
                                    </DetailHeartButton>
                                </DetailThumbnailWrapper>

                                <DetailLeftSection>
                                    <DetailInfo>
                                        <FlexRowContainer
                                            alignItems="center"
                                            gap={16}
                                            css={{
                                                minWidth: 0,
                                                width: "100%",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <DetailTitle>
                                                {book.title}
                                            </DetailTitle>
                                            <DetailAuthor>
                                                {book.authors.join(", ")}
                                            </DetailAuthor>
                                        </FlexRowContainer>
                                        <DetailSectionTitle>
                                            책 소개
                                        </DetailSectionTitle>
                                        <DetailContents>
                                            {book.contents}
                                        </DetailContents>
                                    </DetailInfo>
                                </DetailLeftSection>

                                <DetailRightSection>
                                    <div css={{ flex: 1 }}>
                                        <Button
                                            width={90}
                                            height={36}
                                            backgroundColor="lightGray"
                                            textColor="primary"
                                            onClick={() =>
                                                onToggleDetail(book.isbn)
                                            }
                                        >
                                            상세보기
                                            <ChevronIcon
                                                src={chevronIcon}
                                                alt=""
                                                isExpanded={isExpanded}
                                            />
                                        </Button>
                                    </div>
                                    <PriceInfo>
                                        <PriceText>
                                            원가
                                            <span
                                                css={[
                                                    fonts.body18,
                                                    {
                                                        color: colors.text
                                                            .primary,
                                                        textDecoration:
                                                            "line-through",
                                                    },
                                                ]}
                                            >
                                                {formatPrice(book.price)}원
                                            </span>
                                        </PriceText>
                                        <PriceText>
                                            할인가
                                            <span
                                                css={[
                                                    fonts.title3,
                                                    {
                                                        color: colors.text
                                                            .primary,
                                                    },
                                                ]}
                                            >
                                                {formatPrice(book.sale_price)}원
                                            </span>
                                        </PriceText>
                                    </PriceInfo>

                                    <Button
                                        width={178}
                                        height={36}
                                        backgroundColor="primary"
                                        onClick={() => {
                                            window.open(book.url, "_blank")
                                        }}
                                    >
                                        구매하기
                                    </Button>
                                </DetailRightSection>
                            </DetailContent>
                        </DetailWrapper>
                    </BookItemWrapper>
                )
            })}
        </BookListContainer>
    )
}

export default BookList

const BookListContainer = styled(FlexColumnContainer)`
    width: 100%;
`

const BookItemWrapper = styled(FlexColumnContainer)`
    width: 100%;
    border-bottom: 1px solid ${colors.palette.lightGray};

    &:last-child {
        border-bottom: none;
    }
`

const ListItem = styled(FlexRowContainer)`
    width: 100%;
    height: 100px;
    padding: 16px 16px 16px 48px;
    align-items: flex-start;
    gap: 16px;
`

const ThumbnailWrapper = styled.div`
    position: relative;
    margin-right: 48px;
`

const BookThumbnail = styled.img`
    width: 48px;
    height: 68px;
    object-fit: cover;
    min-width: 48px;
    min-height: 68px;
`

const HeartButton = styled.button`
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 4px;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`

const HeartIcon = styled.img<{ width?: number; height?: number }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
`

const BookInfo = styled(FlexRowContainer)`
    height: 100%;
    flex: 1;
    min-width: 0;
`

const TitleAuthorContainer = styled.div`
    flex: 1;
    min-width: 60px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const BookTitle = styled.span`
    ${fonts.title3}
    color: ${colors.text.primary};
    margin-right: 16px;
`

const BookAuthor = styled.span`
    ${fonts.body2}
    color: ${colors.text.secondary};
`

const BookPrice = styled.div`
    ${fonts.title3}
    color: ${colors.text.primary};
    margin-right: 56px;
`

const ChevronIcon = styled.img<{ isExpanded?: boolean }>`
    width: 12px;
    height: 12px;
    margin-left: 4px;
    transition: transform 0.3s ease;
    transform: ${({ isExpanded }) =>
        isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
`

// DetailWrapper, DetailContent를 합쳐서 사용하게 되면 닫힌 상태일 때 padding에 의해
// 완전히 닫히지 않는 문제가 있다. 따라서 구현의 편의를 위해 상위 wrapper를 사용한다.
const DetailWrapper = styled.div<{ isExpanded: boolean }>`
    /* transition을 동작하게 하기 위해 auto 대신 적당히 큰 값을 설정 */
    max-height: ${({ isExpanded }) => (isExpanded ? "2000px" : "0")};
    overflow: hidden;
    transition: max-height ${({ isExpanded }) => (isExpanded ? "0.6s" : "0.4s")}
        ease;
`

const DetailContent = styled(FlexRowContainer)`
    width: 100%;
    padding: 24px 16px;
    gap: 24px;
    align-items: stretch;
`

const DetailThumbnailWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
`

const DetailThumbnail = styled.img`
    width: 210px;
    height: 280px;
    object-fit: cover;
`

const DetailHeartButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px;
    border: none;
    background: none;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`

const DetailLeftSection = styled(FlexColumnContainer)`
    flex: 1;
    gap: 16px;
    align-items: flex-start;
    overflow: hidden;
    min-width: 70px;
`

const DetailInfo = styled(FlexColumnContainer)`
    flex: 1;
    gap: 16px;
    align-items: flex-start;
    overflow: hidden;
    min-width: 0;
    width: 100%;
`
const DetailTitle = styled.div`
    ${fonts.title3}
    color: ${colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
`

const DetailAuthor = styled.div`
    ${fonts.caption}
    color: ${colors.text.subtitle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
`

const DetailSectionTitle = styled.div`
    ${fonts.body2Bold}
    color: ${colors.text.primary};
`

const DetailContents = styled.div`
    ${fonts.small}
    color: ${colors.text.primary};
    /* override line-height */
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    min-width: 0;
    width: 100%;
`

const DetailRightSection = styled(FlexColumnContainer)`
    flex: 1;
    gap: 16px;
    align-items: flex-end;
    justify-content: space-between;
`

const PriceInfo = styled(FlexColumnContainer)`
    gap: 8px;
    align-items: flex-end;
`

const PriceText = styled(FlexRowContainer)`
    ${fonts.small}
    color: ${colors.text.secondary};
    align-items: center;
    gap: 8px;
`
