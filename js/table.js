
const e = React.createElement;

class List extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		// for(0 = i, ,)
		// this.props.map(function(cont, i) {
		// 	cont.key = i;
		// 	console.log(cont);
		// })
		return e('tr', this.props.cont, null);
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wait: true,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleGetData();
	}

	handleGetData() {
		var thiz = this;

        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync("js/data.json",
            function(json_str) {
                thiz.table = JSON.parse(json_str);        
                thiz.setState({
                	wait: false,
                })
            });
	}

	render() {
		return this.state.wait ? e('div', null, null) :
			e('table', {border: '1', style:{'border-collapse': 'collapse'}},
				this.table.list.map(function(list, i) {
					list.key = i;
					list[i] = list;
					return e(List, list[i], null)}));

	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));