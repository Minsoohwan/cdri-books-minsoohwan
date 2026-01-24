import PageCommon from "../common/layout/PageCommon"
import SearchResultSection from "../common/components/SearchResultSection"
import styled from "@emotion/styled"
import { fonts } from "../theme/font"
import { colors } from "../theme/colors"
import {
    useLikedBooks,
    useRemoveLikedBook,
} from "../api/mock/likedBooksFetcher"

function Page_LikedBooks() {
    const { data: likedBooksData } = useLikedBooks()
    const likedBooks = new Set(likedBooksData?.isbns ?? [])
    const removeLikedBookMutation = useRemoveLikedBook()

    const onToggleLike = async (isbn: string) => {
        await removeLikedBookMutation.mutateAsync(isbn)
    }

    return (
        <PageCommon>
            <Title>내가 찜한 책</Title>
            <SearchResultSection
                type="like"
                totalCount={likedBooksData?.books.length ?? 0}
                allBooks={likedBooksData?.books ?? []}
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
