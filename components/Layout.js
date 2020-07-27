import Head from 'next/head';

const Layout = (props) => (
    <div>
        <Head>
            <title>Brasil API</title>
            <link rel="shortcut icon" type="image/jpg" href="/brasilapi-icon.ico" />
        </Head>
        {props.children}
    </div>
);

export default Layout;