import React,{Component,PropTypes} from 'react'
import {List, Avatar, Pagination, Spin} from 'antd';
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
        return (
        this.props.isFetching == true ?
             <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                  { <Spin />}
             </div> :
        <div>
        <List
          itemLayout="horizontal"
          dataSource={this.props.balance}
          pagination={{ pageSize: 5, }}
          renderItem={ item => ( 
            <List.Item actions={[<a>deposit</a>, <a>withdraw</a>]} >
              <List.Item.Meta
                // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{item.name}</a>}
                description='crypto asset'
              />
               <div>Balance : {item.amount}</div>
            </List.Item>
          )}
        />,
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
           balance:state.user.balance,
           isFetching:state.globalState.isFetching
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