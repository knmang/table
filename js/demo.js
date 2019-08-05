const e = React.createElement;

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return e(Table, {link: 'https://home.chnlab.com/table', skip: 100, add: 30, max: 50}, null);
	}
}
load("js/table.js");

ReactDOM.render(e(Main, null, null), document.getElementById('root'));