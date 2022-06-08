import React, { Component } from "react"
import { connect } from "react-redux"
import { Route, Switch } from "react-router-dom"
import NotFound from "../../../components/notFound"
import TicketAdd from "../../../components/Ticket/TicketAdd"
import TicketList from "../../../components/Ticket/TicketList"
import TicketDetail from "../../../components/Ticket/TicketDetail"

class Ticket extends Component {
  constructor(props) {
    super(props)
  }

  fetch_data(value) {
    this.child.fetch_data({ ...this.child.state, searching_string: value })
  }

  onRef = (ref) => {
    this.child = ref
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.collapsed != nextProps.collapsed) return false
    if (this.props.header_hidden != nextProps.header_hidden) return false
    return true
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.props.onRef(this)
  }

  render() {   
    return (
      <Switch>
        <Route exact key="list" path="/forwarder/ticket/list"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <TicketList {...props} />
          }}
        />
        <Route exact key="add" path="/forwarder/ticket/add"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <TicketAdd {...props} />
          }}
        />
        <Route exact key="detail" path="/forwarder/ticket/detail/:ticketId"
          render={(prop_detail) => {
            const props = { ...this.props, ticketId: prop_detail.match.params.ticketId }            
            return <TicketDetail {...props} />
          }}
        /> 
        <Route component={ NotFound } />
    </Switch>
    )
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.globalState.isFetching,
    forwarder_info: state.shipping_platform_user.account.forwarder_info
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ticket)
