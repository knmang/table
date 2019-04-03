
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
        	if(null != this.props[j] && 'cid' != j)
        	cont.push(e('td', {style:{'text-align': 'center', 'height': '100px'}}, this.props[j]));
    	}
		return e('tr', {ref: this.props.cid}, cont);
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);
		var cont = this.props.cont ? this.props.cont : 10;
		var add = this.props.add ? this.props.add : 10;

		this.state = {
			wait: true,
			scrollHeight: window.innerHeight,
			CacheData: null,
			cont: cont,
			height: 0,
			add: add,
		}

		this.handleGetData = this.handleGetData.bind(this);
		this.handleGetCache = this.handleGetCache.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleGetCache);
	}

  	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleGetCache);
		caches.delete('test-cache');
  	}

	handleGetData() {
		var thiz = this;
		var dataLocation = this.props.dataLocation;
		
        load("http://chnlab.com/xs/js/authorize.js");
        httpGetAsync(dataLocation,
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
		var isBottom = window.innerHeight + window.scrollY;

		if(isBottom >= clientHeight) {
			// console.log('12');
			this.setState((prevState) => ({
				// CacheData: JSON.parse(localStorage.getItem('data')),
				cont: prevState.cont + this.state.add,
			}));
		}
	}

	render() {
		var num = this.state.cont;
		var thiz = this;

		return this.state.wait ? e('div', null, null) :
			e('table', {ref: 'tableHeight', border: '1', style:{'border-collapse': 'collapse'}},
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(cont, i) {
					cont.cid = i;
					if(num >= i)
					return e(Column, cont, null)
				}));
	}
}

ReactDOM.render(e(Table, {dataLocation: 'js/data2.json'}, null), document.getElementById('root'));