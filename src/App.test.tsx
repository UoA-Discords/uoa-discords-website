import React from 'react';
import { render, screen } from '@testing-library/react';
import store from './redux/store';
import { Provider } from 'react-redux';
import App from './App';

// TODO: use createRoot instead of ReactDOM.render, https://reactjs.org/link/switch-to-createroot.
test('renders learn react link', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
    const linkElement = screen.getByText(/an unspecified university's discord server catalogue/i);
    expect(linkElement).toBeInTheDocument();
});
