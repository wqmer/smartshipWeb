import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import ShippingCarrier from "../../../components/setting/ShippingCarrier"
import NotFound from "../../../components/notFound"

class Setting extends Component {
    constructor(props) {
      super(props)
    }

    componentDidMount() {
      window.scrollTo(0, 0)
      this.props.onRef(this)
    }

    render() {
      const { url } = this.props.match
      
      return (
        <Switch>
          <Route exact key="shipping_carrier" path={`${url}/shipping_carrier`}
            render={(props) => {
              props = { ...this.props }                         
              return <ShippingCarrier />
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
)(Setting)
