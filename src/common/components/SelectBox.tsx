import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import { type ReactNode } from "react"
import chevronIcon from "../../assets/icon/chevron.svg"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"

interface SelectBoxProps {
    width?: string | number
    height?: string | number
    label?: ReactNode
    value?: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: Array<{ value: string; label: string; disabled?: boolean }>
    isOpen?: boolean
}

function SelectBox({
    width = "100%",
    height = "36px",
    label,
    value,
    onChange,
    options,
    isOpen = false,
}: SelectBoxProps) {
    return (
        <Container width={width}>
            {label && (
                <Label gap={4} alignItems="center">
                    {label}
                    <ChevronIcon src={chevronIcon} isOpen={isOpen} />
                </Label>
            )}
            <SelectWrapper height={height}>
                <Select value={value} onChange={onChange}>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </Select>
                {!label && <ChevronIcon src={chevronIcon} isOpen={isOpen} />}
            </SelectWrapper>
        </Container>
    )
}

export default SelectBox

const Container = styled(FlexColumnContainer)<{ width?: string | number }>`
    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "100%"};
    position: relative;
`

const Label = styled(FlexRowContainer)`
    ${fonts.body2}

    color: ${colors.text.primary};

    margin-bottom: 4px;
`

const SelectWrapper = styled.div<{ height?: string | number }>`
    position: relative;

    width: 100%;
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "36px"};
`

const Select = styled.select`
    ${fonts.body2}

    width: 100%;
    height: 100%;

    padding: 0 8px;
    padding-right: 24px;

    border: none;
    border-bottom: 1px solid ${colors.palette.gray};

    background-color: transparent;
    color: ${colors.text.primary};

    appearance: none;

    cursor: pointer;

    &:focus {
        border-bottom-color: ${colors.palette.primary};
    }

    &:hover {
        border-bottom-color: ${colors.palette.primary};
    }
`

const ChevronIcon = styled.img<{ isOpen?: boolean }>`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%)
        ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
    pointer-events: none;
    width: 12px;
    height: 12px;
    transition: transform 0.2s;
`
