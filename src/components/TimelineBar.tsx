import { useState, useMemo } from 'react';
import { Card, Popover, Row, Col, Button, TimePicker } from 'antd';
import { blue } from '@ant-design/colors';

type TimelineProps = {
    day: Date;
    timeline: [start: Date[], end: Date[]];
    endTime?: Date;
    dayStartTime?: Date;
    tickerSpacing: number;
    height?: number;
    hoverable?: boolean;
    title: string;
};

function formatAMPM(date: Date) {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ampm;
    return strTime;
}

enum Segment { SOLID,  EMPTY };
type TimelineSegment = Array<[type: Segment, start: number, end: number]>;

export default function TimelineBar(props: TimelineProps) {

    const height = props.height || 32;
    const [hoveredSegment, setHoveredSegment] = useState(-1);
    
    const defaultDayStartTime = new Date(props.day.toDateString());
    defaultDayStartTime.setHours(8);
    let startTime = props.dayStartTime || defaultDayStartTime;

    let endTime = new Date(defaultDayStartTime);
    endTime.setDate(endTime.getDate() + 1);
    endTime.setHours(endTime.getHours() - 4);

    // if (!endTime) {
    //     endTime = new Date(Math.max.apply(null, props.timeline[1].map(d => d.getTime())));
    // }

    // let endTime = props.endTime;
    // if (!endTime) {
    //     endTime = new Date(Math.max.apply(null, props.timeline[1].map(d => d.getTime())));
    // }

    let segments: TimelineSegment = useMemo(
        () => {
            let last = +startTime;
            let segments: TimelineSegment = [];
            for (let i = 0; i < props.timeline[0].length; i++) {
                if (+props.timeline[1][i] > last && +props.timeline[1][i] <= +endTime) {
                    segments.push([Segment.EMPTY, +last, +props.timeline[0][i]]);
                    segments.push([Segment.SOLID, +props.timeline[0][i], +props.timeline[1][i]]);
                    last = +props.timeline[1][i];
                }
            }
            return segments;
        },
        [props.timeline]
    );
    console.log(props.timeline);

    const totalMs = (+endTime - +startTime);
    let tickers = useMemo(
        () => {
            let spacing = props.tickerSpacing;
            while (Math.floor(totalMs / 3600000) % spacing !== 0) {
                spacing--;
            }
            let tickers = [];
            for (let d = new Date(startTime); +d < +endTime; d.setHours(d.getHours() + spacing)) {
                tickers.push(formatAMPM(d));
            }
            return tickers;
        }, 
        [startTime, endTime]
    );
    
    return (
        <Card 
            hoverable={props.hoverable || false}
            title={props.title} 
            bordered={false} 
            style={{ height: 60 + 3 * height, position: 'relative' }}
        >
            <div style={{ position: 'absolute', width: '100%' }}>
                {/* Tick markers */}
                {tickers.map((_, id) => (
                    <div 
                        key={id} 
                        style={{ 
                            position: 'absolute', 
                            backgroundColor: 'lightgrey', 
                            left: `${(id/tickers.length)*100}%`, 
                            height: height, 
                            width: 1 
                        }}
                    />
                ))}
                {/* Tick labels */}
                {tickers.map((label, id) => (
                    <div 
                        key={id} 
                        style={{ 
                            position: 'absolute', 
                            left: `${(id/tickers.length)*100}%`, 
                            height: height, 
                            top: height 
                        }}
                    >
                        {label}
                    </div>
                ))}
                {segments.map(([type, start, end], id) => {
                    let style: any = {
                        height: height,
                        position: 'absolute',
                        width: `${(end - start) / totalMs * 100}%`,
                        left: `${(start - +startTime) / totalMs * 100}%`
                    };
                    let popoverContent;
                    if (type === Segment.SOLID) {
                        style.backgroundColor = id === hoveredSegment ? blue[4] : blue.primary;
                        let startString = (new Date(start)).toTimeString().substring(0, 5);
                        let endString = (new Date(end)).toTimeString().substring(0, 5);
                        let hours = Math.floor((end - start) / 3600000);
                        let minutes = Math.round((end - start) / 60000 - hours * 60);
                        popoverContent = (
                            <div>
                                <h3>{hours}h {minutes}m</h3>
                                <div>{startString} - {endString}</div>
                            </div>
                        );
                    }
                    let body = (
                        <div
                            key={id}
                            style={style}
                            onMouseEnter={() => setHoveredSegment(id)}
                            onMouseLeave={() => setHoveredSegment(-1)}
                        />
                    );
                    return type === Segment.SOLID ? (
                        <Popover key={id} content={popoverContent}>
                            {body}
                        </Popover>
                    ) : body;
                })}
            </div>
        </Card>
    );
}