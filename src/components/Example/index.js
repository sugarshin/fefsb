import React, { Component } from 'react'
import Octicon from 'react-octicon'
import styles from './index.sss'

export default class Example extends Component {
  render() {
    return <div className={styles.root}>Example
      <Octicon name='sync' /></div>
  }
}
