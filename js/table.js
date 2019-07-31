
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
	}

	handleGetIdTop() {
		if(this.props.list[0] == this.props.id) {
			console.log(this.props.id);
			// console.log(this.props.id + ': '+ this.refs.id.offsetTop);
			this.props.setTop(this.refs.id.offsetTop);
		}
	}

	render() {
		var cont = [];

        for (var a in this.props.list) {
        	if(null != this.props.list[a])
            	cont.push(e('td', {ref: 'id'}, this.props.list[a]));
        	if(0 == a)
        		this.handleGetIdTop();
        }

        return e('tr', null, cont);
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
			type: 0,
			min: 0,
			index: 20,
			add: 15,
			id: null,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleGetNext = this.handleGetNext.bind(this);
		this.handleGetBefore = this.handleGetBefore.bind(this);
		this.handleShowData = this.handleShowData.bind(this);
		this.handleBinding = this.handleBinding.bind(this);
		this.handleSetTop = this.handleSetTop.bind(this);
		this.handleGetData();
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

	handleSetTop (offsetTop){
		// console.log(this.showData);
		this.refs.table.scrollTop = offsetTop;
	}

	handleGetNext() {	
		if(this.state.index > this.state.count){
			this.setState((prevState) => ({
				skip: prevState.skip + this.state.count,
				min: 0,
				index: 20,
				type: 1,
			}));
			this.handleGetData();
		}else{
			this.setState((prevState) => ({
	        	min: prevState.min + Math.floor(this.state.add*0.8),
	        	index: prevState.index + this.state.add,
	        	type: 3,
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
					type: 2,
				}))
				this.handleGetData();
			}			
		}else{
			this.setState((prevState) => ({
				min: prevState.min - Math.floor(this.state.add*0.8),
				type: 4,
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
		var id = 0;

		for(var i = this.state.min; i < this.state.index; i++){
			if (getbuffer[i])
			change.push(getbuffer[i]);
		}
		if(1 == this.state.type){
			
			// id = this.showData[this.showData.length - 1][0];
			// id = change[0][0];
			// console.log(this.showData);
			// console.log(this.showData[this.showData.length - 1][0]);
			// console.log(change[0][0]);
			this.showData = (this.showData.slice(-10,-1)).concat(this.showData.slice(-1)).concat(change);
			// console.log(this.state.id);
			// console.log(this.showData);
		}if(2 == this.state.type){
			console.log(2);
			id = this.showData[0][0];
			this.showData = change.concat(this.showData.slice(0,9));
		}if(3 == this.state.type){
			id = this.showData[this.showData.length - 1][0];
			this.showData = change;
		}
		if(4 == this.state.type){
			id = this.showData[0][0];
			this.showData = change;
		}else{
			this.showData = change;
		}
		
		this.setState({
			type: 0,
			id: id,
		})
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
		var thiz = this;
		var id = this.state.id;

		return this.state.wait ? e('div', null, null) :
		e('div', {ref: this.handleBinding},
			e(Button, this.showData, null),
			e('div', {ref: 'table', style: {overflowY: 'scroll', 'padding-top': '53px', height:'93vh', white:'100vw'}},
				e('table', null,
					e(Row, {title: this.table.title}, null),
					this.showData.map(function(list, i) {
						return e(Column, {list: list, setTop: thiz.handleSetTop, id: id}, null)
					}))));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));