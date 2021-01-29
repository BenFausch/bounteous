import React from "react";
import axios from "axios";
import ShowList from "./ShowList"
import { Container, Button, Input  } from '@material-ui/core';

var component = null;

export class TVShowContainer extends React.Component {
	constructor(props) {
		super(props);

		//component alias for nested functions
		component = this;

		this.state = {
			searching: false,
			invalid: true,
			searchQuery: "",
			errorMsg: "",
			showList:[],
		};
	}

	/**
	 * Performs GET to API
	 **/
	getTVShowNames() {
		let query = component.state.searchQuery;

		component.setState({ searching: true, errorMsg: "" });

		console.log("SEARCHING FOR", query);

		axios
			.get(
				`http://api.tvmaze.com/search/shows?q=${encodeURIComponent(
					query
				)}`
			)
			.then(function (response) {
				// handle success
				component.sortAndStore(response.data);
			})
			.catch(function (error) {
				// handle error
				console.log("API ERROR", error);
				component.setState({ errorMsg: error.message });
			});
	}

	/**
	 * Sorts response, stores to localstorage
	 **/
	sortAndStore(data) {
		let sorted = data.sort(function (a, b) {
			return a.show.name > b.show.name ? 1 : -1;
		});

		component.setState({showList:sorted})

		let titles = sorted.map((s) => s.show.name);
		
		console.log("SORTED TITLES");
		console.table(titles);
		
		component.storeTitles(sorted);
	}

	/**
	 * Stores titles as JSON array in localstorage
	 **/
	storeTitles(sorted) {
		let storedItem = localStorage.getItem("shows");
		if (storedItem) {
			localStorage.removeItem("shows");
		}

		localStorage.setItem("shows", JSON.stringify(sorted));

		console.log("STORED JSON", localStorage.getItem("shows"));
	}

	/**
	 * Simple string checker, disables submit on min/max
	 **/
	checkString(e) {
		let value = e.target.value;

		component.setState({ searchQuery: e.target.value });

		if (value.length > 1 && value.length < 60) {
			component.setState({ invalid: false });
		} else {
			component.setState({ invalid: true });
		}
	}

	/**
	 * Simple handlers for keyboard
	 **/
	onKeyUp(event) {
		//submit
		if (event.keyCode === 13 && component.state.invalid === false) {
			component.getTVShowNames();
		}

		//clear on delete
		if(event.keyCode === (8 || 46)){
			component.setState({showList:[]})
		}
	}

	render() {
		return (
			<Container className="tv-container">
				<h1>Search for Shows!</h1>
				<Input
					value={component.state.searchQuery}
					onChange={(e) => component.checkString(e)}
					onKeyUp={component.onKeyUp}
				></Input>
				<Button
					onClick={() => component.getTVShowNames()}
					disabled={component.state.invalid}
					color="primary"
				>
					Get
				</Button>
				<p className="error-container">{component.state.errorMsg}</p>
				<ShowList list={component.state.showList}></ShowList>
			</Container>
		);
	}
}

export default TVShowContainer;