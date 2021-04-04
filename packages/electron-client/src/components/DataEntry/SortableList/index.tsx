import ListSort from "./ListSort";
import "./index.css"
import { PageHeading } from "../..";

const styles = {
	wrapper: {
		position: 'relative',
		background: '#e6e6e6',
		overflow: 'hidden',
		height: 385
	}
};

type SortableListProps = {
	data: {
		title: string;
		text: string;
	}[]
};

export default function SortableList(props: SortableListProps) {

	const childrenToRender = props.data.map((item, i) => {
		const { title, text } = item;
		return (
			<div key={i} className="sortable-list-list">
				<PageHeading 
					title={title}
					subText={text}
					// extra={
					// 	<Button 
					// 		type="text" 
					// 		shape="circle" 
					// 		icon={<SettingOutlined  />}
					// 	/>
					// } 
				/>
			</div>
		);
	});

	return (
		<div className="sortable-list-wrapper">
			<div className="sortable-list">
				<ListSort
					dragClassName="list-drag-selected"
					appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
				>
					{childrenToRender}
				</ListSort>
			</div>
		</div>
	);
}