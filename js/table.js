
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

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return e('div', {style:{height: '50px', width: '100vw', 'background-color': 'white', 'position': 'fixed' ,'top': 0}},
			e('div', {className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}}, '123'),
			e('div', {className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}}, '456'));
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wait: true,
			skip: 1000,
			count: 100,
			min: 0,
			max: 50,
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
			if(this.state.count > this.state.max){		
				this.setState((prevState) => ({
					// count: prevState.count + 20,
					max: prevState.max + 10,
					min: prevState.min + 10,
				}));
			}else{
				this.setState((prevState) => ({
					skip: prevState.skip + 95,
				}))
				this.handleGetData();
			}
			// this.handleGetData();
		}

		if(0 == window.scrollY) {
			this.setState((prevState) => ({
				min: prevState.min - 10,
				max: prevState.max - 10,
			}));
			if(0 > this.state.min)
				this.setState({
					min: 0,
				})
			if(50 > this.state.max)
				this.setState({
					max: 50,
				})
		}
	}

	handleGetData() {
		var thiz = this;
        var skip = this.state.skip;
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
		var max = this.state.max;
		var min = this.state.min;

		return this.state.wait ? e('div', null, null) :
		e('div', null,
			e(Button, null, null),
			e('table', {ref: 'tableHeight', style:{'margin-top': '55px'}},
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(list, i) {
					if(min < i && i < max)
					return e(Column, list, null)
				})));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));