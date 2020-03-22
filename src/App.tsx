import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import SnakeClient from "./components/snake-client.component";

function App() {
  return (
      <Router>
        <div className={'App'}>
          <Route exact path={"/"} component={SnakeClient}/>
        </div>
      </Router>
  );
}

export default App;
