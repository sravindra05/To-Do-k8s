import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";

class SignUpForm extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {
   function attempt_signup(){
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value
    var details = {
      'username': username,
      'password': password,
    };
  fetch('http://localhost/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      'Accept': 'application/json'
    },
    body: JSON.stringify(details)
  })
  .then((response)=>{
    if (!response.ok) {
      if (response.status==401)
      throw new Error('Username already exists');
    }
    return response.json()
  })
  .then((data)=>{
    alert("Signup Success!")
    window.location.href="/login";
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
              <h5>Sign-Up</h5>
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
              <button className="btn btn-small green waves-effect" onClick={attempt_signup}>
                SignUp
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default SignUpForm;
