import React, { Component } from 'react';
import Select from 'react-select';
import getData from './helpers/api';
import { API_URL } from './const/api';
import './App.css';

class App extends Component {
  state = {
    input: 1.0,
    dropOptions: [
      { value: "USD", label: "US Dollar" },
      { value: "CAD", label: "Canadian Dollar" },
      { value: "IDR", label: "Indonesian Rupiah" },
      { value: "GBP", label: "British Pound Sterling" },
      { value: "CHF", label: "Swiss Franc" },
      { value: "SGD", label: "Singapore Dollar" },
      { value: "INR", label: "Indian Rupee" },
      { value: "MYR", label: "Malaysian Ringgit" },
    ],
    selectedCurr: { value: "USD", label: "US Dollar" },
    converterList: [], // List of object: { value: "", label: "" }
    forexPrice: {},
  };

  componentDidMount = () => {
    // fetch data from forex API
    getData(API_URL)
    .then((data) => {
      this.setState({ forexPrice: data.rates });
    })
    .catch(e => window.alert("ERROR FETCHING DATA"))
  }

  _onChange = (e) => {
    this.setState({ input: e.target.value });
  }

  _onSelect = (selectedCurr) => {
    this.setState({ selectedCurr });
  };

  _onClick = () => {
    const { converterList } = this.state;
    converterList.push(this.state.selectedCurr);
    this.setState({ converterList });
  }

  createCurrencyConverter = (id, label, code, price) => <div key={id} className="converter">
    <div 
      className="converter-del"
      onClick={() => this.deleteButton(id)}
    >
      -
    </div>
    <div className="converter-label">
      {label}
    </div>
    <div className="converter-code">
      {code}
    </div>
    <div className="converter-price">
      { isNaN(price) ? "Please input valid number" : price }
    </div>
  </div>;

  deleteButton = (id) => {
    const { converterList } = this.state;
    converterList.splice(id, 1);
    this.setState({ converterList });
  }

  render() {    
    return (
      <div className="App">
        <div className="input-section">
          <input
            className="input-field"
            type="text"
            size="25"
            value={this.state.input}
            onChange={this._onChange}           
          />
          <p>USD</p>
        </div>
        <div className="changer-section">
          <p>Add a Converter from USD to </p>
          <div className="dropdown">
            <Select
              options={this.state.dropOptions}
              onChange={this._onSelect}
              value={this.state.selectedCurr}
            />
          </div>          
          <button
            className="button-add"
            onClick={this._onClick}
          >
            ADD
          </button>
        </div>
        <div className="list-forex">
          { 
            this.state.converterList.map((val, id) => {
              // check if the value for certain currency code exist
              const forexPrice = this.state.forexPrice[val.value] ? this.state.forexPrice[val.value] : 0;
              const price = forexPrice * this.state.input;
              return this.createCurrencyConverter(id, val.label, val.value, price);
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
