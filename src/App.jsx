import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Home from './pages/Home';
import Animals from './pages/Animals';
import Lambs from './pages/Lambs';
import Groups from './pages/Groups';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/animals" component={Animals} />
              <Route path="/lambs" component={Lambs} />
              <Route path="/groups" component={Groups} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info rtl">
      <Link className="navbar-brand" to="/">
        עמוד הבית
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto justify-content-center">
          <li className="nav-item">
            <Link className="nav-link" to="/animals">
              כבשים
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lambs">
              טליים
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/groups">
              קבוצות
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
