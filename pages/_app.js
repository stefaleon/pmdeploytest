import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import { AuthProvider } from 'context/AuthContext';
import { AppProvider } from 'context/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  );
}

export default MyApp;
