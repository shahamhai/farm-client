import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './App.css';

import Animals from './pages/Animals';
import Groups from './pages/Groups';
import Home from './pages/Home';
import Lambs from './pages/Lambs';
import Types from './pages/Types';

import animalsStore from './models/animalsStore';
import typesStore from './models/typesStore';
import groupsStore from './models/groupsStore';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/animals" render={() => <Animals store={animalsStore} />} />
              <Route path="/lambs" component={Lambs} />
              <Route path="/groups" render={() => <Groups store={groupsStore} />} />
              <Route path="/types" render={() => <Types store={typesStore} />} />
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
          <li>
            <Link className="nav-link" to="/types">
              Types
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
