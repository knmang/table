
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
		// if(this.props.list[0] == this.props.id) {
		// 	this.props.setTop(this.refs.id.offsetTop);
		// }
	}

	render() {
		var cont = [];

        // for (var a in this.props.list) {
        // 	if(null != this.props.list[a])
        //     	cont.push(e('td', {ref: 'id'}, this.props.list[a]));
        // 	if(0 == a)
        // 		this.handleGetIdTop();
        // }

        for (var a in this.props) {
        	if(null != this.props[a])
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
		this.handleSetTop = this.handleSetTop.bind(this);
		this.handleButton = this.handleButton.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		this.props.onRef(this);
	}

	//判断滚动条状况
  	handleScroll() {
		var {clientHeight,scrollTop,scrollHeight} = this.refs.table;
		var isBottom = clientHeight + scrollTop === scrollHeight;
			
		if(isBottom){
			this.handleGetNext();
		}

		if(0 == this.refs.table.scrollTop) {
			this.handleGetBefore();	
		}
	}

	handleSetTop (offsetTop){
		// this.refs.table.scrollTop = offsetTop;
	}

	//下翻
	handleGetNext() {
		if(this.state.max > this.state.count){
			//缓存数据读取完，要重新拿数据
			this.setState((prevState) => ({
				skip: prevState.skip + this.state.count,
				min: 0,
				max: this.props.max,
				type: 1,
			}), () => {
				this.handleGetData();
			})		
		}else{
			//缓存有数据，下翻
			this.setState((prevState) => ({
	        	// min: prevState.min + Math.floor(this.state.add*0.8),
	        	min: prevState.max - 1,
	        	max: prevState.max + this.state.add - 1,
	        	// type: 3,
	        }), () => {
				this.handleShowData();
	        })
		}	
	}

	//上翻
	handleGetBefore() {
		if(0 >= this.state.min){
			//缓存数据读取完，要重新拿数据
			if(this.state.skip > this.props.skip){
				this.setState((prevState) => ({
					skip: prevState.skip - this.state.count,
					min: this.props.max,
					max: this.props.max * 2,
					type: 2,
				}), () => {
					this.handleGetData();
				})			
			}			
		}else{
			//缓存有数据，上翻，1、剩下数据够再次递减，2、不够递减。
			this.state.max > this.props.max ? this.setState((prevState) => ({
				// min: prevState.min - Math.floor(this.state.add*0.8),
				min: prevState.min + this.state.add - 2,
				max: prevState.max - this.state.add - 2,
				// type: 4,
			}),() => {
				this.handleShowData();
			}) : this.setState((prevState) => ({
				min: prevState.min - Math.floor(this.state.add*0.8),
				// type: 4,
			}), () => {
				this.handleShowData();
			})		
		}
	}

	//滚动后获取新数据
	handleShowData() {
		var getbuffer =  JSON.parse(sessionStorage.getItem('buffer')).data;
		var change = [];
		var id = 0;

		for(var i = this.state.min; i < this.state.max; i++){
			if (getbuffer[i])
			change.push(getbuffer[i]);
		}
		// if(1 == this.state.type){
		// 	//不够缓存数据型下翻
		// 	id = this.showData[this.showData.length - 1][0];
		// 	this.showData = (this.showData.slice(-10,-1)).concat(this.showData.slice(-1)).concat(change);
		// }else if(2 == this.state.type){
		// 	//不够缓存数据型上翻
		// 	id = this.showData[0][0];
		// 	this.showData = change.concat(this.showData.slice(0,9));
		// }else if(3 == this.state.type){
		// 	//下翻
		// 	id = this.showData[this.showData.length - 1][0];
		// 	this.showData = change;
		// }else if(4 == this.state.type){
		// 	//上翻
		// 	id = this.showData[0][0];
		// 	this.showData = change;
		// }else{
		// 	//首次
		// 	this.showData = change;
		// }

		if(1 == this.state.type) {
			//不够缓存数据型下翻
			this.showData = (this.showData.slice(-10,-1)).concat(this.showData.slice(-1)).concat(change);
		}else if(2 == this.state.type) {
			//不够缓存数据型上翻
			this.showData = change.concat(this.showData.slice(0,9));
		}else {
			//正常翻滚
			this.showData = change;
		}
		// console.log(this.showData);
		this.setState({
			type: 0,
			// id: id,
		})
	}

	handleButton(btnType) {	
		btnType ? this.refs.table.scrollTop = 0 : this.refs.table.scrollTop = this.refs.table.scrollHeight;
	}

	//获取缓存数据
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
		// var id = this.state.id;

		return this.state.wait ? e('div', null, null) :
			e('div', {ref: 'table', style: {overflowY: 'scroll', height:'100vh', white:'100vw'}, onScroll: this.handleScroll},
				e('table', {style: {'margin-top' : '55px',}},
					e(Row, {title: this.table.title}, null),
					this.showData.map(function(list, i) {
						// return e(Column, {list: list, setTop: thiz.handleSetTop, id: id}, null)
						return e(Column, list, null)
					})));
	}
}

// ReactDOM.render(e(Table, {onRef: this.onRef, link: 'https://home.chnlab.com/table', skip: 100, add: 5, max: 15}, null)), document.getElementById('root'));