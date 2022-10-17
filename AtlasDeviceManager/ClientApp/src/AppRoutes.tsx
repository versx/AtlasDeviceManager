import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Devices } from './pages/Devices';
import ManageDevice from './pages/ManageDevice';
import { Home } from './pages/Home';

const AppRoutes = [
    {
        index: true,
        path: '/',
        requireAuth: false,
        element: <Home />,
        key: Home.displayName,
    },
    {
        index: false,
        path: '/devices',
        requireAuth: true,
        element: <Devices />,
        key: Devices.displayName,
    },
    {
        index: false,
        path: '/device/manage/:uuid',
        requireAuth: true,
        element: <ManageDevice />,
        key: ManageDevice.name,
    },
    ...ApiAuthorzationRoutes
];

export default AppRoutes;
