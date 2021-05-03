import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================

class Intro extends React.Component {
  render() {
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m10 offset-m1 card center">
              <h4>To-Do-k8s!</h4>
              <h6>A kubernetes powered tool to track your plans!</h6>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Intro;
