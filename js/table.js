
const e = React.createElement;

class Row extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var cont = [];
        for (var a in this.props) {
        	if(null != this.props[a])
            cont.push(e('th', {style:{'text-align': 'center'}}, this.props[a]));
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
        	if(null != this.props[a])
            cont.push(e('td', null, this.props[a]));
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

        var skip = 1000;
        var count = 10;

        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync("https://home.chnlab.com/table/?skip=" + skip + "&count=" + count,
            function(json_str) {
                thiz.table = JSON.parse(json_str);        
                //thiz.setState({
                //	wait: false,
                //})
                console.log(thiz.table);
            });
	}

	render() {
		return this.state.wait ? e('div', null, null) :
			e('table', {border: '1', style:{'border-collapse': 'collapse'}},
				this.table.list.map(function(list, i) {
					var Tag = 0 == i ? Row : Column ;
					return e(Tag, list, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));
