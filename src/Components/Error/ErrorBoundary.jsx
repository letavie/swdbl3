import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Cập nhật state để hiển thị UI dự phòng
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Bạn có thể ghi log lỗi vào một dịch vụ log lỗi
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Bạn có thể hiển thị bất cứ UI dự phòng nào
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
