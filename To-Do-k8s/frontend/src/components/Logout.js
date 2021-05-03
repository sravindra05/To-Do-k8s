import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";


class Logout extends React.Component {
  componentDidMount(){
    function change(){
      window.location.href='/login';
    }
    function logout(){
      localStorage.removeItem("token")
      setTimeout(change,3000);
      
    }
    logout();
  }
  render() {
    
    return (
      <>
        <main >
          <div className="container">
             <div className="row">
               <div className="col s12 m8 offset-m2 center">
                <h5 className="center">Logging you out. We hope to see you again.</h5>
                <div className="preloader-wrapper big active">
                  <div className="spinner-layer spinner-blue">
                    <div className="circle-clipper left">
                      <div className="circle"></div>
                    </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
               </div>
             </div>
          </div> 
          </div>
        </main>
      </>
    );
  }
}
export default Logout;
