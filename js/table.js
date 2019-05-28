
const e = React.createElement;

class Row extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var cont = [];
        for (var a in this.props.title) {
        	if(null != this.props.title[a])
            cont.push(e('th', {style:{'text-align': 'center'}}, this.props.title[a]));
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
			count: 10,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleIsBottom = this.handleIsBottom.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleIsBottom);
	}

  	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleIsBottom);
  	}

  	handleIsBottom() {
		var {clientHeight} = this.refs.tableHeight;
		var isBottom = window.innerHeight + window.scrollY;

		if(isBottom >= clientHeight) {
			this.setState((prevState) => ({
				count: prevState.count + 10,
			}));
			this.handleGetData();
		}
	}

	handleGetData() {
		var thiz = this;
        var skip = 1000;
        var count = this.state.count;

        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync("https://home.chnlab.com/table/?skip=" + skip + "&count=" + count,
            function(json_str) {
                thiz.table = JSON.parse(json_str);        
                thiz.setState({
                	wait: false,
                })
            });
	}

	render() {
		return this.state.wait ? e('div', null, null) :
			e('table', {ref: 'tableHeight', border: '1', style:{'border-collapse': 'collapse'}},
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(list, i) {
					// var Tag = 0 == i ? Row : Column ;
					// return e(Tag, list, null)
					return e(Column, list, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));