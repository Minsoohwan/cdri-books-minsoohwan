import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import searchIcon from "../../assets/icon/search.svg"
import closeIcon from "../../assets/icon/close.svg"
import Button, { type ButtonProps } from "./Button"
import { FlexRowContainer } from "../style/FlexContainer"
import { useState, useRef } from "react"
import {
    useSearchHistory,
    removeSearchHistory,
    useInvalidateSearchHistory,
    type SearchHistoryItem,
} from "../../api/mock/searchHistoryFetcher"

interface ButtonConfig extends ButtonProps {
    text: string
    onClick?: () => void
}

interface SearchPanelProps {
    value?: string
    placeholder?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onHistoryClick?: (query: string) => void
    buttonConfig?: ButtonConfig
    gap?: string | number
    buttonId?: string
}

function SearchPanel({
    value,
    placeholder = "검색어를 입력하세요",
    onChange,
    onHistoryClick,
    buttonConfig,
    gap = "16px",
    buttonId,
}: SearchPanelProps) {
    const [isFocused, setIsFocused] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const { data: searchHistoryData } = useSearchHistory()
    const historyItems = searchHistoryData?.items ?? []
    const invalidateSearchHistory = useInvalidateSearchHistory()

    const onHIstoryClick = (item: SearchHistoryItem) => {
        if (onHistoryClick) {
            onHistoryClick(item.query)
        } else {
            const syntheticEvent = {
                target: { value: item.query },
            } as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
        }
        setIsFocused(false)
    }

    const onRemoveHistory = async (e: React.MouseEvent, timestamp: number) => {
        e.stopPropagation()
        await removeSearchHistory(timestamp)
        invalidateSearchHistory()
    }

    const showHistory = isFocused && historyItems.length > 0

    return (
        <Panel gap={typeof gap === "number" ? gap : gap || 16}>
            <SearchWrapper
                ref={wrapperRef}
                onClick={() => {
                    if (!isFocused) {
                        setIsFocused(true)
                    }
                }}
            >
                <SearchContainer hasHistory={showHistory}>
                    <SearchIcon src={searchIcon} alt="" />
                    <SearchTextBox
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                if (
                                    !wrapperRef.current?.contains(
                                        document.activeElement
                                    )
                                ) {
                                    setIsFocused(false)
                                }
                            }, 200)
                        }}
                    />
                </SearchContainer>
                {showHistory && (
                    <HistoryContainer>
                        {historyItems.map((item) => (
                            <HistoryItem
                                key={item.timestamp}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    onHIstoryClick(item)
                                }}
                            >
                                <HistoryText>{item.query}</HistoryText>
                                <RemoveButton
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) =>
                                        onRemoveHistory(e, item.timestamp)
                                    }
                                >
                                    <RemoveIcon src={closeIcon} alt="remove" />
                                </RemoveButton>
                            </HistoryItem>
                        ))}
                    </HistoryContainer>
                )}
            </SearchWrapper>
            {buttonConfig && (
                <Button
                    id={buttonId}
                    width={buttonConfig.width ?? 72}
                    height={buttonConfig.height ?? 35}
                    backgroundColor={buttonConfig.backgroundColor ?? "white"}
                    textColor={buttonConfig.textColor ?? "subtitle"}
                    border={buttonConfig.border}
                    onClick={buttonConfig.onClick}
                >
                    {buttonConfig.text}
                </Button>
            )}
        </Panel>
    )
}

export default SearchPanel

const Panel = styled(FlexRowContainer)<{ gap?: string | number }>`
    width: 100%;
`

const SearchWrapper = styled.div`
    position: relative;
    flex: 1;
`

const SearchContainer = styled.div<{ hasHistory: boolean }>`
    border-radius: ${({ hasHistory }) =>
        hasHistory ? "18px 18px 0 0" : "18px"};
    background-color: ${colors.palette.lightGray};

    position: relative;
    width: 100%;
`

const SearchIcon = styled.img`
    position: absolute;
    left: 0.75em;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25em;
    height: 1.25em;
    pointer-events: none;
    z-index: 1;
`

const SearchTextBox = styled.input`
    ${fonts.caption}

    width: 100%;
    height: 36px;

    padding: 0 1em;
    text-indent: 2em;

    border: none;
    background: none;

    color: ${colors.text.primary};

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: ${colors.text.subtitle};
    }
`

const HistoryContainer = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: ${colors.palette.lightGray};
    border-top: 1px solid ${colors.palette.gray};
    border-radius: 0 0 18px 18px;
    overflow: hidden;
    z-index: 1000;
`

const HistoryItem = styled.div`
    ${fonts.caption}
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 1em 8px 2.5em;
    cursor: pointer;
    color: ${colors.text.primary};
    border-radius: 0;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`

const HistoryText = styled.span`
    flex: 1;
`

const RemoveButton = styled.button`
    padding: 4px;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;

    &:hover {
        opacity: 0.7;
    }
`

const RemoveIcon = styled.img`
    width: 12px;
    height: 12px;
`
