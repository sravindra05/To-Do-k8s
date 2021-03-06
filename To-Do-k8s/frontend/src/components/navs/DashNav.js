import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
// ========================================
import M from "materialize-css";

class DashNav extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }

  render() {
    return (
      <header>
        <nav>
          <div className="nav-wrapper black">
            <a href="#" className="brand-logo">
              The To-Do Project
            </a>
            <ul id="nav-mobile" className="right">
              <li>
                <a className="waves-effect waves-light btn green" href="#">
                  <NavLink to="/logout" exact>
                    Logout
                  </NavLink>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default DashNav;
