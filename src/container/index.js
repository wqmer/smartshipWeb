import React, { Component } from "react"
import "ant-design-pro/dist/ant-design-pro.css"
import { message, notification,} from "antd"
import { Router, Route, Switch } from "react-router-dom"
import createHistory from "history/createBrowserHistory"
import ComopnentLogin from "./shipping_user/login_page"
import Home from "./shipping_user/home"
import NotFound from "../components/notFound"
import { connect } from "react-redux"

export const history = createHistory();

class AppIndex extends Component {
  constructor(props) {
    super(props)
  }

  state = {}

  static getDerivedStateFromProps = (props, state) => {
    if (props.message && props.status_code === 0) {
      message.success(props.message)
    }

    if (props.message && props.status_code === 1) {
      let config = {
          message: "远程服务器报错",
          description: props.message,
      }
      notification.error(config)
    }
    return null
  }

  render() {
    return (
      <Router history={history} >
        <div>
          <Switch>
            <Route exact path="/" component={ComopnentLogin} />
            <Route exact path="/login" component={ComopnentLogin} />
            <Route path="/forwarder" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.globalState.message,  
    status_code: state.globalState.status_code
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppIndex)