import Script from 'next/script';
import { ThemeProvider } from 'next-themes'; // for dark-light mode on site

import { NFTProvider } from '../context/NFTContext';
import { Navbar, Footer } from '../components';
import '../styles/globals.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'https://www.alphamint.online:4001/graphql',
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }) => (
  <ApolloProvider client={apolloClient}>
    <NFTProvider>
      <ThemeProvider attribute="class">
        <div className="dark:bg-nft-dark bg-white min-h-screen">
          <Navbar />
          <div className="pt-65">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>

        <Script
          src="https://kit.fontawesome.com/4622253fa3.js"
          crossOrigin="anonymous"
        />
      </ThemeProvider>
    </NFTProvider>
  </ApolloProvider>
);

export default MyApp;
