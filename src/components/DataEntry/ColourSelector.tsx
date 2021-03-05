import { Col, Row, Select } from "antd";
import { CSSProperties } from "react";

const { Option } = Select;

type SelectProps = Parameters<typeof Select>[0];

type Gradient = { to: string; from: string };
type ColourSelectorProps = {
    items: Gradient[];
    entriesPerRow: number;
    dropdownMenuStyle?: CSSProperties;
    eggSize?: number;
} & SelectProps;


const getEggStyle = (gradient: Gradient) => ({
    backgroundColor: gradient.from,
    backgroundImage: `linear-gradient(315deg, ${gradient.from} 0%, ${gradient.to} 74%)`
})

const Egg = (props: { gradient: Gradient, size: number | string }) => (
    <div 
        style={{
            ...getEggStyle(props.gradient),
            width: props.size || 30,
            paddingBottom: props.size || 30,
            borderRadius: '50%',
        }} 
    />
)

export default function ColourSelector(props: ColourSelectorProps) {
    const { items, entriesPerRow,
        ...selectProps
    } = props;

    let rows: Gradient[][] = [];
    for (let i = 0; i < items.length; i++) {
        if (i % entriesPerRow === 0)
            rows[rows.length] = [];
        rows[Math.floor(i / entriesPerRow)].push(items[i])
    }

    return (
        <Select
            {...selectProps}
            placeholder="Select a colour"
            size="large"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, alignSelf: 'center', position: 'relative' }}
        >   
            {items.map((item, i) => (
                <Option key={i} value={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Egg size={30} gradient={item} />
                </Option>
            ))}
        </Select>
    );
}