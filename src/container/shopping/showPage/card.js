import { Skeleton, Layout, Menu, Breadcrumb,Icon} from 'antd';
import   React, {Component, PropTypes} from 'react'
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { Card } from 'antd';


// const Mycard = (props) =>  

class Mycard extends Component{
       constructor(props){
              super(props);
          }
state = {loading : true}

handeload = () => {
                  console.log('loding begin')
                  this.setState({loading:false})
}

render(){
       const { Meta } = Card
       return(<div>   
               {this.state.loading == true? <Skeleton loading = {this.state.loading} active /> :  null}
               <Card
                      hoverable 
                      style={{ width: 240  }}
                      cover={<img 
                            alt="example" 
                            src= {this.props.url}
                            // onMouseEnter = {}
                            // onError = { () => this.handeload()}
                            // onLoadedData  = { () => this.handeload()}
                            onLoad = { () =>  this.handeload() }
                            // onMouseEnter = { ()=>  console.log('mouse in')}
                            // onMouseLeave = { () => console.log('mouse out')}  
                           
                            />}
                      >          
                     <Meta
                      style = {{overflow: 'auto', height:80}}
                      title= {this.props.title}
                      description = {this.props.desc}
                      />
            
               </Card>  
            
       
           
</div>)
}




}


                   


export default Mycard