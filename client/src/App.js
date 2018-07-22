import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux'
import * as actions from './actions'
import { Card, CardHeader, CardBody, CardFooter } from "react-simple-card";
import Modal from 'react-awesome-modal';
import moment from 'moment'
import qs from 'qs'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      modal:false,
      detailData:{}
    }
    this.closeModal=this.closeModal.bind(this)
    this.openModal=this.openModal.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount(){
    this.props.fetchUser()
  }

  closeModal(){
    this.setState({
        modal:false
    })
  }

  handleDelete(userID){
    console.log('userID '+userID)
    this.props.deleteUser(userID,(res)=>{
      if(res.data.status=='success'){
        alert('record deleted!')
        this.props.fetchUser();
      }
    })
  }

  openModal(item){
    this.setState({
      modal:true,
      detailData:item
    })
  }

  render() {
    var data=this.props.users||[]
    var that=this
    //open modal
    if(this.state.modal){
      var modalView=<Details addUser={this.props.addUser} edituser={this.props.editUser} fetchUser={this.props.fetchUser} visible={that.state.modal} data={this.state.detailData} closeModal={that.closeModal}/>
    }
    else{
        var modalView=""
    }
    console.log(data)
    return (
      <div className="row clearfix">
        <div className="col-md-6 col-md-offset-6">
        <Card>
          <CardHeader><center><b>All Users</b>{'  '}<button onClick={()=>that.openModal()} type="button" class="btn btn-success">Add {<i className="fa fa-plus" style={{fontSize:"18px"}}></i>}</button></center></CardHeader>
          <CardBody>
            <ul>
              {
                data.map(function(item,index){
                  var dateString = moment.unix(parseInt(item.DateOfBirth)/1000).format("DD/MM/YY");
                  return <li key={index}><b>Name: </b>{item.FirstName+' '+item.LastName}<br/><b>DOB: </b>{dateString}<br/><b>Email: </b>{item.EmailID+'  '}<b>Mobile: </b>{item.Mobile}
                          <span style={{float:'right'}}><button type="button" onClick={()=>that.openModal(item)} class="btn btn-info">Edit</button>{'  '}<button type="button" onClick={()=>that.handleDelete(item.UserID)} class="btn btn-danger">Delete</button></span><hr/>
                        </li>
                })
              }
            </ul>
          </CardBody>
        </Card>
        {modalView}
        </div>
      </div>
    );
  }
}

class Details extends React.Component {
  constructor(props) {
      super(props);
      var data=this.props.data||{}
      this.state = {
          visible : this.props.visible,
          submitting:false,
          formData:{
            'firstName':data.FirstName||'',
            "lastName":data.LastName||'',
            'emailID':data.EmailID||'',
            'dob':data.DateOfBirth||'',
            'mobile':data.Mobile||'',
            'userID':data.UserID||''
          }
      }
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
  }

  openModal() {
      this.setState({
          visible : this.props.visible
      });
  }

  handleChange(e){
    var formData=this.state.formData;
    formData[e.target.name]=e.target.value;

    this.setState({
      formData:formData
    })
  }

  handleSubmit(){
    var data = this.props.data
    if(data==null||data==undefined){

      this.props.addUser(qs.stringify(this.state.formData),function(res){
          if(res.data.status=='success'){
            alert('User added successfully!!!')
            this.props.closeModal()
            this.props.fetchUser();
          }
      })
    }
    else{
        this.props.edituser(qs.stringify(this.state.formData),(res)=>{
          console.log(res)
          if(res.data.status=='success'){
            console.log('!!SUCCESS')
            alert('Updated!!!')
            this.props.closeModal()
            this.props.fetchUser();
          }
      })
    }
  }

  closeModal() {
      this.setState({
          visible : false
      });
  }

  render() {
      var data=this.props.data
      console.log(data)
      var formData=this.state.formData
      return (
              <Modal visible={true} width="600" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                  <div style={{margin:'10px'}}>
                  <div className="form-group">
                    <label for="firstName">First Name:</label>
                    <input type="firstName" className="form-control" onChange={(e)=>{this.handleChange(e)}} value={formData.firstName} name="firstName"/>
                  </div>
                  <div className="form-group">
                    <label for="email">Last Name:</label>
                    <input type="text" className="form-control" onChange={(e)=>{this.handleChange(e)}} value={formData.lastName} name="lastName"/>
                  </div>
                  <div className="form-group">
                    <label for="email">Email address:</label>
                    <input type="email" className="form-control" onChange={(e)=>{this.handleChange(e)}} value={formData.emailID} name="emailID"/>
                  </div>
                  <div class="form-group">
                    <label for="pwd">DOB:</label>
                    <input type="text" class="form-control" onChange={(e)=>{this.handleChange(e)}} value={formData.dob} name="dob"/>
                  </div>
                  <div class="form-group">
                    <label for="pwd">Mobile:</label>
                    <input type="number" class="form-control" onChange={(e)=>{this.handleChange(e)}} value={formData.mobile} name="mobile"/>
                  </div>
                
                  <button type="submit" disabled={this.state.submitting} onClick={()=>this.handleSubmit()} class="btn btn-success">Submit</button>{'  '}
                  <button type="button" onClick={() => this.props.closeModal()} class="btn btn-primary">Close</button>
                  </div>
              </Modal>
          
      );
  }
}

function mapStateToProps({ users }) {   
  return { users };   
}

export default connect (mapStateToProps,actions)(App);
