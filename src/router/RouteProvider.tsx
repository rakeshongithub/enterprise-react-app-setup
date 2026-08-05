import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth';
import RouteManager from './RouteManager';
import { NavigationProvider } from './navigation';

export default function RouteProvider() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavigationProvider>
          <RouteManager />
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
