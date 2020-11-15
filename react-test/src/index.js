import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { namnsdagar } from "./namnsdagar";

jsToJSON(namnsdagar);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
  );
  
function jsToJSON(namnsdagar) {
  let date = new Date("2020-01-01");
  let namnsDagJSON = [];
  let names = new Array(12);

  for(let i = 0; i < names.length; i++) {
    names[i] = [];
  }
  
  for(let i = 1; i <= 366; i++) {
    date = new Date(2020, 0, i);
    namnsDagJSON.push({
      "month": date.getMonth(),
      "date": date.getDate(),
      "name": namnsdagar[i - 1]
    });
    names[date.getMonth()][date.getDate() - 1] = (namnsdagar[i - 1]);
    
  }

  console.log(namnsDagJSON);
  console.log(names);
}


// names[month][date]