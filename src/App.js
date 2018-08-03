import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class StatsView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'green',
    }

    this.onSelect = this.onSelect.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onSelect() {
    this.props.onSelect(this.props.symbol);
  }

  onLeave() {
    this.props.onLeave();
  }

  toggle() {
    if(this.props.showInfo === 1) {
      this.onLeave();
    } else {
      this.onSelect(this.props.symbol);
    }
  }

  render() {
    let color;
    if(this.props.showInfo === 1) {
      console.log('result info: ');
      console.log(this.props.info);
      if(this.props.info.changePercent < 0) {
        color = 'red';
      }
      else {
        color = 'green'
      }
    return (
      <div className={"Result" + ' ' + color} onClick={this.toggle}>
        <div className="name">{this.props.name}</div>
        <div className="symbol">({this.props.symbol})</div>
        High<br />
        <div className="high">${this.props.info.high}</div>
        Latest<br />
        <div className="latest">${this.props.info.latest}</div>
        Low<br />
        <div className="low">${this.props.info.low}</div>
        Percent Change<br />
        <div className="changePercent">{this.props.info.changePercent}%</div>
        <br />
        <button onClick={this.props.showNews}>News Related to {this.props.symbol}</button>
      </div>
    )
  } else {
      return (
        <div className="Result" onClick={this.toggle}>
          <div className="name">{this.props.name}</div>
          <div className="symbol">({this.props.symbol})</div>
        </div>
      )
  }
  }
}

class ResultGrid extends Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.toggle = this.toggle.bind(this);
}

  onSelect(symbol) {
    this.props.onSelect(symbol);
  }

  onLeave() {
    this.props.onLeave();
  }

  toggle() {
    this.props.onToggle();
  }

  render() {
    let numResults = this.props.numResults;
    let output = [];
    var i;
    for(i = 0; i < numResults; i++) {
      if(this.props.info.symbol === this.props.symbols[i]) {
      output.push(<Result key={i} showNews={this.props.showNews} showInfo={1} info={this.props.info} name={this.props.names[i]} symbol={this.props.symbols[i]} onLeave={this.onLeave} onToggle={this.toggle} onSelect={this.onSelect}/>);
      }
      else {
        output.push(<Result key={i} showInfo={0} info={this.props.info} name={this.props.names[i]} symbol={this.props.symbols[i]} onLeave={this.onLeave} onToggle={this.toggle} onSelect={this.onSelect}/>);

      }
    }
    return (
      <div className="ResultGrid">
        {output}
      </div>
    )
  }
}
class SearchBox extends Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {

    let value = e.target.value;

    this.props.onChange(value);
  }
  render() {
    return (
    <div className="SearchBox">
    <input className="search" type="search" onChange={this.handleChange}/>
    </div>
    );
  }
}

class SearchBoxContainer extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      symbols: [],
      names: [],
      numResults: 0,
    };
    this.updateValue = this.updateValue.bind(this);
    this.checkNames = this.checkNames.bind(this);
  }

  updateValue(newValue) {

    this.setState({value: newValue});

    this.checkNames(newValue);
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    let tmpNames = [];
    let tmpSymbols = [];
    fetch('https://api.myjson.com/bins/19up6g')
    .then((res) => {
      return res.json();
    }).then((data) => {

      var i;
      for(i = 0; i < data.length; i++) {
        let name = data[i]['Name'];
        let symbol = data[i]['Symbol'];

        tmpNames.push(name);
        tmpSymbols.push(symbol);
      }
    });

    this.setState({names: tmpNames});
    this.setState({symbols: tmpSymbols});
  }

  checkNames(newValue) {
    console.log('newVal' + newValue);

    let newNumResults = 0;
    let names = [];
    let symbols = [];

    var i;
    for(i = 0; i < this.state.names.length; i++) {
      if(this.state.names[i].indexOf(newValue) === 0) {

        names.push(this.state.names[i]);
        symbols.push(this.state.symbols[i]);

        newNumResults++;
      }
    }

    this.setState({numResults: newNumResults});
    this.props.onUpdateInfo(names, symbols, newNumResults);
  }

  render() {
    return (
    <div>
    <SearchBox onChange={this.updateValue} />
    </div>
    )
  }

}


class App extends Component {
	constructor() {
		super();
		this.state = {
      names: [],
      symbols: [],
      numResults: 0,
      showInfo: 0,
      info: [],
		}
		this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
    this.runApi = this.runApi.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.toggle = this.toggle.bind(this);
	}

	handleInfoUpdate(newNames, newSymbols, newNumResults) {
    console.log('handling info update...');

    this.setState({names: newNames});
    this.setState({symbols: newSymbols});
    this.setState({numResults: newNumResults});
	}

  runApi(symbol) {
    console.log('runApi');
    console.log(symbol);
    let url = 'https://api.iextrading.com/1.0/stock/' + symbol + '/book';
    let newInfo = {};


      fetch(url)
      .then((res) => {
        return res.json();
      }).then((data) => {
        console.log(data);
        newInfo = ({
          symbol: data['quote']['symbol'],
          changePercent : data['quote']['changePercent'],
          high : data['quote']['high'],
          low : data['quote']['low'],
          latest : data['quote']['latestPrice'],
        });

        console.log('info:');
        console.log(newInfo);
        console.log('high: ' + newInfo.high);

        this.setState({showInfo: 1});
        this.setState({info: newInfo});
      });
  }

  onLeave() {
    this.setState({showInfo: 0});
    this.setState({info: []});
  }

  toggle() {
    if(this.state.showInfo === 0) {
      this.setState({showInfo: 1});
    } else {
      this.setState({showInfo: 0});
    }
  }

  showNews() {
    let url = 'https://api.iextrading.com/1.0/stock/' + this.state.symbol + '/news';
    fetch(url)
    .then((res) => {
      return res.json();
    }).then((data) => {
      
    });
  }

  render() {
    console.log('render: ');
    console.log(this.state.info);
    return (
      <div className="App">
          <header>
            <span>NASDAQ Stock View</span>
          </header>
		      <SearchBoxContainer onUpdateInfo={this.handleInfoUpdate} />
          <ResultGrid showNews={this.showNews} info={this.state.info} showInfo={this.state.showInfo} names={this.state.names} symbols={this.state.symbols} numResults={this.state.numResults} onSelect={this.runApi} onLeave={this.onLeave} onToggle={this.toggle}/>
      </div>
    );
  }
}

export default App;
