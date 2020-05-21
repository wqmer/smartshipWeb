import React,{Component,PropTypes} from 'react'
import {List, Avatar, Pagination, Spin, Button} from 'antd';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../../reducers/order'
import Table from './table'
import xlsx from 'xlsx'
import GenerateSheet from './generateSheet'

class order extends Component{
    constructor(props){
        super(props);
    }
    // componentDidMount(){
    //     this.props.getAllorder();
    // }
    render(){   
        return (
        this.props.isFetching == true ?
             <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                  { <Spin />}
             </div> :
        <div>
        <Table  />
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
           order:state.user.order,
           isFetching:state.globalState.isFetching
    }
}

function mapDispatchToProps(dispatch) {
    return{
          getAllorder : bindActionCreators(actions.get_all_order,dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(order)

