import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Login from "../../../components/Login/loginForm"
import { actions as user_account_actions } from "../../../reducers/shipping_platform/user"

class UserLogin extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.auth()
  }

  render() {
    const { login } = this.props

    return (
      <div className="login">
        {this.props.forwarder_info.forwarder_id ? this.props.history.push("forwarder/dashboard/project_summary")
          : <Login login={(data) => login(data)}
        />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    status_code: state.globalState.status_code,
    forwarder_info: state.shipping_platform_user.account.forwarder_info
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(user_account_actions.get_login, dispatch),
    auth: bindActionCreators(user_account_actions.user_auth, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLogin)