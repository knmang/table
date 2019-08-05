const e = React.createElement;

//button 实现放这里都比放 table 要好, 这样当我们使用和修改 table 的时候会更方便

class Main extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {
        // button 应该在这个地方布局
		return e(Table, {link: 'https://home.chnlab.com/table', skip: 100, add: 30, max: 50}, null);
	}
}
load("js/table.js");

ReactDOM.render(e(Main, null, null), document.getElementById('root'));
