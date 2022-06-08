import React, { Component } from "react"
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux"
import NotFound from "../../../components/notFound"
import ClientAdd from "../../../components/Client/ClientAdd"
import ClientDetail from "../../../components/Client/ClientDetail"
import ClientList from "../../../components/Client/ClientList"

class Client extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentDidMount() {
    window.scrollTo(0, 0)
 }

  render() {   
    return (
      <Switch>
        <Route exact key="list" path="/forwarder/client/list"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <ClientList {...props} />
          }}
        />
        <Route exact key="add" path="/forwarder/client/add"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <ClientAdd {...props} />
          }}
        />
        <Route exact key="detail" path="/forwarder/client/detail/:clientId"
          render={(prop_detail) => {
            const props = { ...this.props, clientId: prop_detail.match.params.clientId }            
            return <ClientDetail {...props} />
          }}
        />
       <Route component={ NotFound } />
      </Switch>
    )
  }
}

function mapStateToProps(state) {
    return {
        isFetching: state.globalState.isFetching
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Client)
