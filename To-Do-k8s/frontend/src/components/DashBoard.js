import React from "react";
import "materialize-css/dist/css/materialize.min.css";


function genTaskCard(title,description,id){
  var div_element=document.createElement("div");
  div_element.setAttribute("class","col s12 center card");
  var h4_element=document.createElement("h4")
  h4_element.innerHTML=title
  var h6_element=document.createElement("h6")
  h6_element.innerHTML=description
  var button_element=document.createElement("button")
  button_element.setAttribute("class","btn-floating btn- red waves-effect")
  button_element.innerHTML='<i class="material-icons">delete</in>'
  button_element.setAttribute("id",id)
  button_element.addEventListener("click",(e)=>{
    console.log(e.target.id)
    fetch('http://localhost:8000/api/users/me/tasks/'+e.currentTarget.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization':'Bearer '+localStorage.getItem("token")
      }
    })
    .then((response)=>{
      if (!response.ok) {
        if (response.status==401){
        window.location.href="/login"
        throw new Error('Invalid credentials');
        }
        else{
          throw new Error('Oops something went wrong!');
        }
      }
      return response.json()
    })
    .then((data)=>{
      return data;
    })
    .catch((err)=>{
      alert(err)
    })
    e.currentTarget.parentNode.remove();
  })
  div_element.appendChild(h4_element)
  div_element.appendChild(h6_element)
  div_element.appendChild(button_element)
  document.getElementById("tasks").appendChild(div_element)
  
}
class DashBoard extends React.Component {
  componentDidMount() {
    function getTasks(){
      fetch('http://localhost:8000/api/users/me/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem("token")
          },
        })
        .then((response)=>{
          if (!response.ok) {
            throw new Error('Invalid Credentials!');
          }
          return response.json()
        })
        .then((data)=>{
          for(let i=0;i<data.data.length;i++){
            genTaskCard(data.data[i]["title"],data.data[i]["description"],data.data[i]["id"])
          }
        })
        .catch((err)=>{
          alert(err)
          window.location.href="/logout"
        })
    }
    getTasks()
    
  }
  render() {
    
    function addTask(){
      var title=document.getElementById("title").value;
      var desc=document.getElementById("desc").value;
      if( title=="" || desc==""){
        alert("Please fill all fields");
        return
      }
      fetch('http://localhost:8000/api/users/me/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem("token")
          },
          body:JSON.stringify({
            "title":title,
            "description":desc
          })
        })
        .then((response)=>{
          if (!response.ok) {
            if (response.status==401){
            throw new Error('Invalid Credentials!');
            }
            else{
              throw new Error('Oops something went wrong!');
            }
          }
          return response.json()
        })
        .then((data)=>{
          genTaskCard(data["data"]["title"],data["data"]["description"],data["data"]["id"])
        })
        .catch((err)=>{
          alert(err)
          window.location.href="/logout"
        })
    
    }
    return (
      <>
        <main id="main" >
          
          <div className="container">
            <div className="row">
            <h3 className="center">Dashboard</h3>
              <div id="tasks" className="col s12 m8 offset-m2 center">
                <div className="card" id="add">
                <h5>Add Task</h5>
                  <div className="input-field col s12 m6">
                      
                      <input
                        className="validate"
                        type="text"
                        name="title"
                        id="title"
                        required
                      />
                      <label for="title">Title</label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        className="validate"
                        type="text"
                        name="desc"
                        id="desc"
                        required
                      />
                      <label for="desc">Description</label>
                    </div>

                    
                    <a className="btn-floating btn-large blue waves-effect addTask" onClick={addTask} >
                    <i class="material-icons">add</i>
                    </a>

                  </div>
                  <h5>Tasks</h5>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
export default DashBoard;
