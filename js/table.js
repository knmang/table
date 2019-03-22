
const e = React.createElement;

class Row extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var cont = [];
        for (var a in this.props) {
            cont.push(e('td', null, this.props[a]));
        }
		return e('tr', null, cont);
	}
}

class Column extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var cont = [];
        for (var a in this.props) {
            cont.push(e('th', null, this.props[a]));
        }
		return e('tr', null, cont);
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
		var b = null;
		return this.state.wait ? e('div', null, null) :
			e('table', {border: '1', style:{'border-collapse': 'collapse'}},
				this.table.list.map(function(list, i) {
					var Tag = 0 == i ? Row : Column ;
					return e(Tag, list, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));