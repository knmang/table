const e = React.createElement;

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

 	handleUp() {		
		this.props.btnType(1);
	}
	handleDown() {
		this.props.btnType(0);
 	}

	render() {
		return e('div', {style:{height: '50px', width: '98.5vw', 'background-color': 'white', 'position': 'fixed' ,'top': 0}},
			e('div', {onClick: this.handleUp.bind(this), className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}}, '上滚'),
			e('div', {onClick: this.handleDown.bind(this), className:'weui-btn weui-btn_mini weui-btn_primary', style:{'margin-left' :'20px'}}, '下滚'));
	}
}

class Main extends React.Component {
	constructor(props) {
		super(props);

		this.handleButton = this.handleButton.bind(this);
	}

	onRef(ref) {
		Table = ref;
	}

	handleButton(type) {
		Table.handleButton(type);
	}

	render() {
		return e('div', null,
			e(Button, {btnType: this.handleButton, }, null),
			e(Table, {onRef: this.onRef, link: 'https://home.chnlab.com/table', skip: 100, max: 50,}, null));
	}
}

load("js/table.js");

ReactDOM.render(e(Main, null, null), document.getElementById('root'));