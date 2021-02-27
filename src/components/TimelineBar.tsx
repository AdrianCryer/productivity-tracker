import { useState, useMemo } from 'react';
import { Card, Popover } from 'antd';
import { blue } from '@ant-design/colors';
import { Duration } from '../core';
import { formatAMPM, formatDuration } from '../core/helpers';

type TimelineProps = {
    day: Date;
    durations: Duration[];
    endTime?: Date;
    dayStartTime?: Date;
    tickerSpacing: number;
    height?: number;
    hoverable?: boolean;
    title: string;
};

const getTimeStartArray = (durations: Duration[]): [Date[], Date[]] => {
    let start = [];
    let end = [];
    for (let { timeStart, timeEnd } of durations) {
        start.push(new Date(timeStart));
        end.push(new Date(timeEnd));
    }
    return [start, end];
};

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

    let segments: TimelineSegment = useMemo(
        () => {
            // Convert to an ordered array for ease of use.
            const durations = (props.durations || []).sort((a, b) => +a.timeEnd - +b.timeEnd);
            const timeline: [start: Date[], end: Date[]] = getTimeStartArray(durations);

            let last = +startTime;
            let segments: TimelineSegment = [];
            for (let i = 0; i < timeline[0].length; i++) {
                if (+timeline[1][i] > last && +timeline[1][i] <= +endTime) {
                    segments.push([Segment.EMPTY, +last, +timeline[0][i]]);
                    segments.push([Segment.SOLID, +timeline[0][i], +timeline[1][i]]);
                    last = +timeline[1][i];
                }
            }
            return segments;
        },
        [props.durations]
    );

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
            style={{ height: 60 + 3 * height, overflowX: 'hidden' }}
        >
            <div style={{ position: 'absolute', width: '100%' }}>
                {/* Tick markers */}
                {tickers.map((_, id) => (
                    <div 
                        key={id} 
                        style={{ 
                            position: 'absolute', 
                            left: `${(id/tickers.length)*100}%`, 
                            height: height, 
                            borderLeftWidth: 1,
                            borderLeftStyle: 'dashed',
                            borderLeftColor: 'lightgray',

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
                        left: `${(start - +startTime) / totalMs * 100}%`,
                        borderRadius: 5
                    };
                    let popoverContent;
                    if (type === Segment.SOLID) {
                        style.backgroundColor = id === hoveredSegment ? blue[4] : blue.primary;
                        let startDate = new Date(start);
                        let endDate = new Date(end);
                        let startTime = startDate.toTimeString().substring(0, 5);
                        let endTime = endDate.toTimeString().substring(0, 5);

                        popoverContent = (
                            <div>
                                <h3>{formatDuration(startDate, endDate)}</h3>
                                <div>{startTime} - {endTime}</div>
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