import React, { Component } from 'react';
import {Jumbotron, Grid, Row, Col} from 'react-bootstrap';
import './App.css';

//filter the search result
function isSearched(searchTerm){
  return (item) =>
          !searchTerm || item.name.fullName.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      result: null,
      record: null,
      searchUser:'Riaz',
      searchTerm:''
    }

    this.myResults = this.myResults.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  searchValue(event){
    this.setState({searchTerm: event.target.value});
    console.log(this.state.searchTerm)
  }

  addRecord(user){
    const {searchUser} = this.state;
    let myRes = this.state.result.filter((result)=>result.login.username === user).map((result)=>result);
    this.setState({searchUser: myRes[0].login.username});
  }

  myResults(mineResult){
      const{results} = mineResult;
      const newList = results.map((item)=>{

            item.name.fullName = item.name.first.charAt(0).toUpperCase()+item.name.first.slice(1) +' '+item.name.last.charAt(0).toUpperCase()+item.name.last.slice(1)
            
            return (item)
      });
      this.setState({record: results[0]});
      this.setState({result: newList});
  }

  componentDidMount(){
    fetch('https://randomuser.me/api/?results=10')
    .then(response=>
          response.json())
    .then(data=>
          this.myResults(data))
    .catch(e=>e);
  }

  render() {
    //You may like to show loading indicator while retrieving data:
    const {result = undefined} = this.state;
    const {searchUser, searchTerm} = this.state;
    if(result){
      return (
          <div className="App">
          <Jumbotron>
            <h1>Profile List</h1>
          </Jumbotron>
            <Grid>
                <Row>
                  <Col md={12} xs={12} sm={12} style={{paddingBottom: "20px"}}>
                    <input type="text" onChange={this.searchValue} placeholder="Search by name" className="myInput"/>
                  </Col>
                  <Col md={12} xs={12} sm={12} style={{paddingBottom: "20px"}}>
                    Hover over profiles for details
                  </Col>
                  <Col xs={6} md={6}>
                    <Table md={4}
                      list = {result}
                      onMouseOver = {this.addRecord}
                      searchTerm = {searchTerm}
                    />
                  </Col>
                  <Col xs={6} md={6}>
                    <Profile
                      searchUser = {searchUser}
                      list = {result}
                      filterOut = {this.filterOut}
                    />
                  </Col>
                </Row>
              </Grid>
          </div>
      );
    }
    else{
      return(<div>Loading...</div>)
    }
  }

}

 class Table extends Component{

  render(){
    const{list, searchTerm} = this.props;
    return(
            
          list.filter(isSearched(searchTerm)).map((item)=>{
              let title = item.name.title.charAt(0).toUpperCase()+item.name.title.slice(1);
              return( 
                <div key={item.login.username} onMouseOver={() => this.props.onMouseOver(item.login.username)} className="profiles" style={{textAlign: 'left'}}>
                  <img src={item.picture.thumbnail} alt=""/> <span><h4>{title} {item.name.fullName}</h4></span>
                <hr/>
                </div>
              )
            }
          ) 
                   
    )
  }
}

class Profile extends Component{
  render(){
    const{searchUser, list} = this.props;
    return(
        list.filter((item)=> item.login.username === searchUser).map((item)=>{
            let title = item.name.title.charAt(0).toUpperCase()+item.name.title.slice(1);
            return(
              <div key={item.login.username} className="profileBlurb">
                <div className="profileContent">Name: {title} {item.name.fullName}</div>
                <div className="profileContent"><img src={item.picture.large} alt=""/></div>
                <div className="profileContent">Phone: {item.phone}</div>
                <div className="profileContent">Email: {item.email}</div>
              </div>
            )
          }
        )
        
      )
  }
}


export default App;
