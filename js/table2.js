
const e = React.createElement;

class Row extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var cont = [];
		for(var j in this.props.title) {
	        for (var k in this.props.title[j]) {
            	cont.push(e('th', {style:{'text-align': 'center'}}, this.props.title[j][k]));
        	}
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
        for (var j in this.props) {
        	if(null != this.props[j])
        	cont.push(e('td', {style:{'text-align': 'center'}}, this.props[j]));
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
        httpGetAsync("js/data2.json",
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
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(cont, i) {
					return e(Column, cont, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));