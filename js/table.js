
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
			buffer: 0,
			min: 0,
			index: 20,
			add: 15,
			frequency: 0,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleGetNext = this.handleGetNext.bind(this);
		this.handleGetBefore = this.handleGetBefore.bind(this);
		this.handleShowData = this.handleShowData.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

  	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
  	}

  	handleScroll() {
		var {clientHeight} = this.refs.tableHeight;
		var isBottom = window.innerHeight + window.scrollY;

		if(isBottom >= clientHeight) {
			this.handleGetNext();
		}
		if(0 == window.scrollY) {
			this.handleGetBefore();
		}
	}

	handleGetNext() {	
		if(this.state.index > this.state.count){
			console.log(this.state.index);
			this.setState((prevState) => ({
				skip: prevState.skip + this.state.count,
				min: 0,
				index: 20,
				buffer: 1,
			}));
			console.log('1');
			this.handleGetData();
			console.log('1.1');
			console.log(this.state.index);
		}else{
			this.setState((prevState) => ({
	        	min: prevState.min + Math.floor(this.state.add*0.8),
	        	index: prevState.index + this.state.add,        	
	        }));
	        this.handleShowData();
		}	
	}

	handleGetBefore() {
		console.log(this.state.min +' '+ 'before');
		if(0 == this.state.min){
			if(this.state.skip > 1000){
				this.setState((prevState) => ({
					skip: prevState.skip - this.state.count,
					min: 80,
					index: 100,
					buffer: 2,
				}))
				this.handleGetData();
			}			
		}else{
			this.setState((prevState) => ({
				min: prevState.min - Math.floor(this.state.add*0.8),
				index: prevState.index - this.state.add,
			}))
			this.handleShowData();
		}
	}

	handleShowData() {
		var getbuffer =  JSON.parse(sessionStorage.getItem('buffer')).data;
		var change = [];
		for(var i = this.state.min; i < this.state.index; i++){
			if (getbuffer[i])
			change.push(getbuffer[i]);
		}
		if(1 == this.state.buffer){
			this.showData = (this.showData.slice(-10,-1)).concat(this.showData.slice(-1)).concat(change);
		}if(2 == this.state.buffer){
			this.showData = change.concat(this.showData.slice(0,9));
		}else{
			this.showData = change;
		}
		this.showData = change;
		this.setState((prevState) => ({
			frequency: prevState.frequency + 1,
			buffer: 0,
		}))
	}

	handleGetData() {
		var thiz = this;
        var skip = this.state.skip;
        var count = this.state.count;
        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync("https://home.chnlab.com/table/?skip=" + skip + "&count=" + count,
            function(json_str) {
                thiz.table = JSON.parse(json_str);
               	sessionStorage.setItem("buffer", JSON.stringify(thiz.table));
                thiz.handleShowData();
                thiz.setState((prevState) => ({
                	wait: false,
                }))
            });
	}

	render() {
		return this.state.wait ? e('div', null, null) :
		e('div', null,
			e(Button, null, null),
			e('table', {ref: 'tableHeight', style:{'margin-top': '55px'}},
				e(Row, {title: this.table.title}, null),
				this.showData.map(function(list, i) {
					return e(Column, list, null)
				})));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));