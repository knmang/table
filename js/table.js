
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
		this.handleGetIdTop = this.handleGetIdTop.bind(this);
		this.handleGetIdTop();
	}

	handleGetIdTop() {
		// console.log(this.props);
		if(this.props.special == this.props[0]){
			console.log(this.props);
			console.log(this.props[0]);
		}
		// console.log(this.refs.id.offsetTop);
	}

	render() {
		var cont = [];

        for (var a in this.props) {
        	if(null != this.props[a])
            cont.push(e('td', null, this.props[a]));
        }

		// return e('div', null,
		// 	e('div', {className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}, onClick: this.handleGetIdTop}, '123'),
		// 	e('tr', {ref: 'id'}, cont));

		return e('tr', {ref: 'id'}, cont);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	handleUp() {
		
	}

	render() {
		return e('div', {style:{height: '50px', width: '98.5vw', 'background-color': 'white', 'position': 'fixed' ,'top': 0}},
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
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleGetNext = this.handleGetNext.bind(this);
		this.handleGetBefore = this.handleGetBefore.bind(this);
		this.handleShowData = this.handleShowData.bind(this);
		this.handleBinding = this.handleBinding.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		// window.addEventListener('scroll', this.handleScroll);
		// this.refs.table.addEventListener('scroll', this.handleScroll)s;
	}

  	componentWillUnmount() {
		this.refs.table.removeEventListener('scroll', this.handleScroll);
  	}

 	handleBinding() {
 		this.refs.table.addEventListener('scroll', this.handleScroll);
 	}

  	handleScroll() {
		var {clientHeight} = this.refs.table;
		var isBottom = this.refs.table.clientHeight + this.refs.table.scrollTop;

		if(isBottom >= this.refs.table.scrollHeight){
			this.handleGetNext();
		}

		if(0 == this.refs.table.scrollTop) {
			this.handleGetBefore();		
		}
	}

	handleGetNext() {	
		if(this.state.index > this.state.count){
			this.setState((prevState) => ({
				skip: prevState.skip + this.state.count,
				min: 0,
				index: 20,
				buffer: 1,
			}));
			this.handleGetData();
		}else{
			this.setState((prevState) => ({
	        	min: prevState.min + Math.floor(this.state.add*0.8),
	        	index: prevState.index + this.state.add,
	        }));
	        this.handleShowData();
		}	
	}

	handleGetBefore() {
		if(0 >= this.state.min){
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
			}))
			if(20 < this.state.index){
			this.setState((prevState) => ({
					index: prevState.index - this.state.add,
				}))
			}
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
			// this.showData =  this.showData.concat(this.showData.slice(-1)[0][0]);
			console.log(this.showData);
		}
		this.setState((prevState) => ({
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
			e(Button, this.showData, null),
			e('div', {ref: 'table', style: {overflowY: 'scroll', 'padding-top': '53px', height:'93vh', white:'100vw'}},
				e('table', {ref: 'tableHeight'},
					e(Row, {title: this.table.title}, null),
					e('div', {onClick: this.handleBinding, className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}}, '123'),
					this.showData.map(function(list, i) {
						// if(i == 19)
						return e(Column, list, null)
					}))));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));