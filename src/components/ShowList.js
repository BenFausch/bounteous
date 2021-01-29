import React from "react";
import { List, ListItem } from "@material-ui/core";

var component = null;

export default class ShowList extends React.Component {
	constructor(props) {
		super(props);
		component = this;
	}

	//loop and display shows
	shows() {
		let list = component.props.list;

		let container = list.map((l) => {
			return (
				<ListItem key={l.show.id}>
					<h4>{l.show.name}</h4>
					{l?.show?.image?.medium ? (
						<img src={l.show.image.medium} alt={l.show.name} />
					) : (
						""
					)}
					<hr />
				</ListItem>
			);
		});
		return container;
	}

	render() {
		return <List className="shows-list">{component.shows()}</List>;
	}
}