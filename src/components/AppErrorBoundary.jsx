import React from 'react'
import MaintenancePage from '../pages/MaintenancePage.jsx'

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Shadow application error:', error, errorInfo)
  }

  render() {
    const isMaintenanceTest =
  new URLSearchParams(window.location.search).get('maintenance-test') === '1'

if (this.state.hasError || isMaintenanceTest) {
  return <MaintenancePage />
}

    return this.props.children
  }
}
