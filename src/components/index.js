import Table from "./Table"
import Form from "./Form"
import ProcessingPage from "./ProcessingPage"
import React, { Component, PropTypes } from "react"

const componentMapName = (name, props) => {
  switch (name) {
    case "table":
      return (<Table {...props} />)
    case "form":
      return (<Form {...props} />)
    case "processing_page":
      return (<ProcessingPage {...props} />)
    default:
      return undefined
  }
}

export default componentMapName
