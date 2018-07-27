import React,{Component,PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../reducers/user/asset'

const {get_all_balance} = actions;

class balance extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.getAllBalance();
    }

    render(){   
        return ( <div>  { this.props.balance.map( item => (  <div key={item.name}> {item.name} {item.amount}</div> ) ) }  </div>)
    }
}

function mapStateToProps(state) {
    return{
           balance:state.user.balance
    }
}

function mapDispatchToProps(dispatch) {
    return{
          getAllBalance : bindActionCreators(get_all_balance,dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(balance)