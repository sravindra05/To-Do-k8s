import React from "react";
import ReactDOM from "react-dom";

import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";

class LoginForm extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {
    function attempt_login(){
          var username=document.getElementById("username").value;
          var password=document.getElementById("password").value
          var details = {
            'username': username,
            'password': password,
            'grant_type': '',
            'scope':'',
            'client_id':'',
            'client_secret':''
          };
        
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        fetch('http://localhost:8000/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formBody
        })
        .then((response)=>{
          if (!response.ok) {
            throw new Error('Invalid Credentials! Please check your username or password');
          }
          return response.json()
        })
        .then((data)=>{
          localStorage.setItem("token",data.access_token);
          window.location.href="/dashboard";
        })
        .catch((err)=>{
          alert(err)
        })
    }
    return (
      <>
      
        <main className="valign-wrapper">
        
          <div className="row">
            <div className="col s12 m10 offset-m1 card center">
              <h5>Login</h5>
              <div className="input-field col s12">
                <input
                  className="validate"
                  type="text"
                  name="username"
                  id="username"
                  required
                />
                <label for="email">Username</label>
              </div>

              <div className="input-field col s12">
                <input
                  className="validate"
                  type="password"
                  name="password"
                  id="password"
                  required
                />
                <label for="password">Password</label>
              </div>
              <button className="btn btn-small green waves-effect" onClick={attempt_login}>
                Login
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default LoginForm;
