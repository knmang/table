
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
        	if(null != this.props[j])
        	cont.push(e('td', {style:{'text-align': 'center', 'height': '100px'}}, this.props[j]));
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
		this.handleGetCache = this.handleGetCache.bind(this);
		this.handleGetData();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleGetCache);
	}

  	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleGetCache);
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
            });

		if('caches' in window) {
			caches.open('test-cache').then(function(cache) {
		  		cache.add('js/data2.json');
			});
		}

	}

	handleGetCache() {
		caches.open('test-cache').then(function(cache) { 
			cache.keys().then(function(cachedRequests) { 
		    	console.log(cachedRequests);
			});
		});
	}

	render() {
		return this.state.wait ? e('div', null, null) :
			e('table', {border: '1', style:{'border-collapse': 'collapse'}, onscroll: this.handleGetCache},
				e(Row, {title: this.table.title}, null),
				this.table.data.map(function(cont, i) {
					return e(Column, cont, null)
				}));
	}
}

ReactDOM.render(e(Table, null, null), document.getElementById('root'));