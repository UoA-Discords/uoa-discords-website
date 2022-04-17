import { createTheme, CssBaseline, darkScrollbar, ThemeProvider } from '@mui/material';
import * as ReactDOMClient from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});

const container = document.getElementById('root')!;

const root = ReactDOMClient.createRoot(container);

root.render(
    <Provider store={store}>
        <CookiesProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </CookiesProvider>
    </Provider>,
);
