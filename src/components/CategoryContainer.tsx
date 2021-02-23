import React, { Component } from 'react';
import { Card } from 'antd';

export const CategoryContainer = (props: { title: string; }) => {
    return (
        <Card hoverable title={props.title}>
            <p>Content!</p>
        </Card>
    )
}