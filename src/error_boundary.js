import React from "react";
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: "" };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, message: `${error}` };
    }

    componentDidCatch(error, errorInfo) {
        console.log("Error: " + error + "\n" + errorInfo);
        this.props.onError(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong: {this.state.message}</h1>;
        }
        return this.props.children;
    }
}