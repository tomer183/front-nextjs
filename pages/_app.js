import App from 'next/app';
import axios from 'axios';
import '../styles/globals.css';

const dev = process.env.NODE_ENV == 'development';

function MyApp({ Component, pageProps, ...props }) {
    return <Component {...pageProps} host={props.host} />;
}
MyApp.getInitialProps = async (appCtx) => {
    console.log('🔸', { NODE_ENV: process.env.NODE_ENV, dev });

    const appProps = await App.getInitialProps(appCtx);
    const { req } = appCtx.ctx;

    // Client
    if (!req) {
        console.log('👿 - CLIENT -', '_app.js', 'getInitialProps', 'client');
        return { ...appProps };
    }

    const host = req.headers.host.replace('www.', '').replace(':3000', '');
    console.log('👿', { host });

    let API_URL = dev ? `http://api.${host}:3001` : `https://api.${host}`;
    let SERVICES_URL = dev ? `http://services.${host}:3002` : `https://services.${host}/`;
    console.log('👿', { API_URL, SERVICES_URL });

    const url = `${API_URL}/domain`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    };
    console.log('-----------');
    let hostname = 'unknown';
    try {
        let response = await axios(url, options);
        hostname = response.data.host;
        console.log('🔸🔸', 'TRY', response.data);
    } catch (err) {
        hostname = 'error';
        console.log('🔸🔸', 'CATCH', err.message);
    }
    return { ...appProps, A: 1, hostname: 111, host };
};
export default MyApp;
