import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can customize the error message and UI here
      return (
        <div>
          <h1>Oops! Something went wrong.</h1>
          <p>{this.state.error.toString()}</p>
          <p>Stack trace:</p>
          <pre>{this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
