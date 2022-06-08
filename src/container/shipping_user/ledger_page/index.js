import React, { Component } from "react"
import { connect } from "react-redux"
import { Route, Switch } from "react-router-dom"
import NotFound from "../../../components/notFound"
import LedgerAdd from "../../../components/Ledger/LedgerAdd"
import LedgerDetail from "../../../components/Ledger/LedgerDetail"
import LedgerList from "../../../components/Ledger/LedgerList"

class Ledger extends Component {Ledger
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.props.onRef(this)
  }

  render() {   
    return (
      <Switch>
        <Route exact key="list" path="/forwarder/ledger/list"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <LedgerList {...props} />
          }}
        />
        <Route exact key="add" path="/forwarder/ledger/add"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <LedgerAdd {...props} />
          }}
        />
        <Route exact key="detail" path="/forwarder/ledger/detail/:ledgerId"
          render={(prop_detail) => {
            const props = { ...this.props, ledgerId: prop_detail.match.params.ledgerId }            
            return <LedgerDetail {...props} />
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
)(Ledger)
