import React from "react"
import _ from "lodash"
import "antd/dist/antd.css"
import { Switch } from "antd"

class LoadingSwitch extends React.Component {
  state = {
    loading: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    const onChange = (checked) => {
      this.setState({
        loading: true
      })

      this.props.toggleStatus(this, checked)
    }

    return (
      <div>
        <Switch 
          size={this.props.size}
          loading={this.state.loading}
          defaultChecked={this.props.checked}
          onChange={onChange} />
      </div>
    )
  }
}

export default LoadingSwitch