
// const e = React.createElement;

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

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wait: true,
			skip: this.props.skip ? this.props.skip : 0,
			count: this.props.max + 50,
			type: 0,
			min: 0,
			max: this.props.max ? this.props.max : 50,
			add: this.props.add ? this.props.add : 30,
			id: null,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleGetNext = this.handleGetNext.bind(this);
		this.handleGetBefore = this.handleGetBefore.bind(this);
		this.handleShowData = this.handleShowData.bind(this);
		this.handleBinding = this.handleBinding.bind(this);
		this.handleSetTop = this.handleSetTop.bind(this);
		this.handleButton = this.handleButton.bind(this);
		this.handleGetData();
	}

	componentDidMount(){
		this.props.onRef(this);
	}

  	componentWillUnmount() {
		this.refs.table.removeEventListener('scroll', this.handleScroll);
  	}

 	handleBinding() {
 		this.refs.table.addEventListener('scroll', this.handleScroll);		
 	}

  	handleScroll() {
		var {clientHeight} = this.refs.table;
		var isBottom = this.refs.table.clientHeight + this.refs.table.scrollTop + 50;

		if(isBottom >= this.refs.table.scrollHeight){
			this.handleGetNext();
		}

		if(0 == this.refs.table.scrollTop) {
			this.handleGetBefore();		
		}
	}

	handleSetTop (offsetTop){
		this.refs.table.scrollTop = offsetTop;
	}

	handleGetNext() {
		if(this.state.max > this.state.count){
			this.setState((prevState) => ({
				skip: prevState.skip + this.state.count,
				min: 0,
				max: this.props.max,
				type: 1,
			}));
			this.handleGetData();
		}else{
			this.setState((prevState) => ({
	        	min: prevState.min + Math.floor(this.state.add*0.8),
	        	max: prevState.max + this.state.add,
	        	type: 3,
	        }));
	        this.handleShowData();
		}	
	}

	handleGetBefore() {
		if(0 >= this.state.min){
			if(this.state.skip > this.props.skip){
				this.setState((prevState) => ({
					skip: prevState.skip - this.state.count,
					min: this.props.max,
					max: this.props.max * 2,
					type: 2,
				}))
				this.handleGetData();
			}			
		}else{
			this.state.max > this.props.max ? this.setState((prevState) => ({
				min: prevState.min - Math.floor(this.state.add*0.8),
				max: prevState.max - this.state.add,
				type: 4,
			})) : this.setState((prevState) => ({
				min: prevState.min - Math.floor(this.state.add*0.8),
				type: 4,
			}))
			this.handleShowData();
		}
	}

	handleShowData() {
		var getbuffer =  JSON.parse(sessionStorage.getItem('buffer')).data;
		var change = [];
		var id = 0;

		for(var i = this.state.min; i < this.state.max; i++){
			if (getbuffer[i])
			change.push(getbuffer[i]);
		}
		if(1 == this.state.type){
			id = this.showData[this.showData.length - 1][0];
			this.showData = (this.showData.slice(-10,-1)).concat(this.showData.slice(-1)).concat(change);
		}else if(2 == this.state.type){
			id = this.showData[0][0];
			this.showData = change.concat(this.showData.slice(0,9));
		}else if(3 == this.state.type){
			id = this.showData[this.showData.length - 1][0];
			this.showData = change;
		}else if(4 == this.state.type){
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

	handleButton(btnType) {
		btnType ? this.refs.table.scrollTop = 0 : this.refs.table.scrollTop = this.refs.table.scrollHeight;
	}

	handleGetData() {
		var thiz = this;
        var skip = this.state.skip;
        var count = this.state.count;

        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync(this.props.link + "/?skip=" + skip + "&count=" + count,
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
			e('div', {ref: 'table', style: {overflowY: 'scroll', 'padding-top': '53px', height:'93vh', white:'100vw'}},
				e('table', null,
					e(Row, {title: this.table.title}, null),
					this.showData.map(function(list, i) {
						return e(Column, {list: list, setTop: thiz.handleSetTop, id: id}, null)
					}))));
	}
}

// ReactDOM.render(e(Table, null, null), document.getElementById('root'));