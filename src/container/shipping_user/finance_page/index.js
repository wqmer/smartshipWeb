import React, { Component } from "react"
import { connect } from "react-redux"
import { Route, Switch } from "react-router-dom"
import NotFound from "../../../components/notFound"
import TransactionList from "../../../components/Finance/TransactionList"

class Finance extends Component {
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
        <Route exact key="finance" path="/forwarder/finance/transaction_list"
          render={(props) => {
            props = { ...this.props, onRef: this.onRef }                         
            return <TransactionList {...props} />
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
)(Finance)
