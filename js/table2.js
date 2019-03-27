
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
		this.getColumnHeight = this.getColumnHeight.bind(this);
	}

	componentDidMount() {
		this.getColumnHeight();
	}

	getColumnHeight() {
		var cid = this.props.cid;
		var {clientHeight} = this.refs[cid];
		// console.log(clientHeight);
		this.props.setcHeight(clientHeight);
	}

	render() {
		var cont = [];
        for (var j in this.props) {
        	if(null != this.props[j] && 'cid' != j && 'setcHeight' != j)
        	cont.push(e('td', {style:{'text-align': 'center', 'height': '100px'}}, this.props[j]));
    	}
		return e('tr', {ref: this.props.cid}, cont);
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wait: true,
			scrollHeight: window.innerHeight,
			CacheData: null,
			cont: 19,
			height: 0,
		}

    	this.handlesetHeight = this.handlesetHeight.bind(this);
		this.handleGetData = this.handleGetData.bind(this);
		this.handleGetCache = this.handleGetCache.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleGetCache);
		// this.setState({
  //       	scrollHeight: window.innerHeight,
  //       })
	}

  	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleGetCache);
		caches.delete('test-cache');
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
                localStorage.setItem('data',JSON.stringify(thiz.table.data));
            });
  
		// if('caches' in window) {
		// 	caches.open('test-cache').then(function(cache) {
		//   		cache.add('js/data2.json');
		// 	});
		// }

	}

	handleGetCache() {
		// caches.open('test-cache').then(function(cache) { 
		// 	cache.keys().then(function(cachedRequests) { 
		//     	console.log(cachedRequests);
		// 	});
		// });

		var {clientHeight} = this.refs.tableHeight;
		console.log(clientHeight);

		if(this.state.height >= clientHeight-1) {
			this.setState((prevState) => ({
				// CacheData: JSON.parse(localStorage.getItem('data')),
				cont: prevState.cont+20,
			}));
		}
	}

	handlesetHeight(cHeight) {
		// console.log(cHeight);
		var allHeight = this.state.height + cHeight*20;
		this.setState({
			height: allHeight,
		});
    	console.log(this.state.height);
	}

	render() {
		// console.log(this.state.CacheData);
		// console.log(window.scrollY);
		var num = this.state.cont;
		var thiz = this;

		return this.state.wait ? e('div', null, null) :
			e('table', {ref: 'tableHeight', border: '1', style:{'border-collapse': 'collapse','overflow': 'hidden'}},
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(cont, i) {
					cont.cid = i;
					cont.setcHeight = thiz.handlesetHeight;
					if(num >= i)
					return e(Column, cont, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));