// App.tsx
import React, { useState, useEffect, useRef, Component, ReactNode } from 'react';
// FIX: Changed to namespace import to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { AnimatePresence, motion, Transition } from 'framer-motion';

// Configuración de Firebase
import './firebase/config';

// Contextos
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificacionProvider } from './context/NotificacionContext';

// Tipos
import { RolUsuario, type Usuario } from './tipos';

// Vistas
import Login from './vistas/Login';
import VistaConfiguracion from './vistas/Configuracion';
import VistaDashboard from './vistas/Dashboard';
import { VistaEstudiantes } from './vistas/Estudiantes';
import { VistaEventPublico, VistaEvents } from './vistas/Events';
import VistaFirmaConsentimiento from './vistas/FirmaConsentimiento';
import VistaFirmaContrato from './vistas/FirmaContrato';
import VistaFirmaImagen from './vistas/FirmaImagen';
import VistaNotificaciones from './vistas/Notificaciones';
import VistaTienda from './vistas/Tienda';
import VistaTiendaPublica from './vistas/VistaTiendaPublica';
import Vista404 from './vistas/404';

// Componentes
import Footer from './components/Footer';
import NotificacionToast from './components/NotificacionToast';
import BotonVolverArriba from './components/BotonVolverArriba';
import ModalBusquedaGlobal from './components/ModalBusquedaGlobal';
import {
    IconoCampana, IconoCerrar, IconoConfiguracion, IconoDashboard, IconoEstudiantes, IconoEventos,
    IconoLogoOficial, IconoLogoOficialConTexto, IconoLogout, IconoLuna, IconoMenu, IconoSol, IconoTienda,
    IconoBuscar,
} from './components/Iconos';
import Loader from './components/Loader';

// --- Componentes de Layout ---

const BarraLateral: React.FC<{ estaAbierta: boolean; onCerrar: () => void; onLogout: () => void, usuario: Usuario }> = ({ estaAbierta, onCerrar, onLogout, usuario }) => {
    const location = ReactRouterDOM.useLocation();
    const enlaces = [
        { ruta: "/", texto: "Dashboard", icono: IconoDashboard, rol: RolUsuario.Usuario },
        { ruta: "/estudiantes", texto: "Estudiantes", icono: IconoEstudiantes, rol: RolUsuario.Usuario },
        { ruta: "/tienda", texto: "Tienda", icono: IconoTienda, rol: RolUsuario.Usuario },
        // { ruta: "/events", texto: "Eventos", icono: IconoEventos, rol: RolUsuario.Usuario }, // DESHABILITADO TEMPORALMENTE
        { ruta: "/notificaciones", texto: "Alertas", icono: IconoCampana, rol: RolUsuario.Usuario },
        { ruta: "/configuracion", texto: "Configuración", icono: IconoConfiguracion, rol: RolUsuario.Usuario },
    ];
    
    // Ancho variable para el modo colapsado en desktop
    const sidebarWidthClass = estaAbierta ? 'w-64' : 'w-20';

    return (
        <aside className={`bg-tkd-blue text-tkd-gray flex flex-col fixed inset-y-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarWidthClass} ${estaAbierta ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className={`flex items-center justify-center h-20 border-b border-gray-700 ${estaAbierta ? 'p-4' : 'p-2'}`}>
                {estaAbierta ? <IconoLogoOficialConTexto className="w-auto h-12 text-white"/> : <IconoLogoOficial className="w-10 h-10" />}
            </div>
            <nav className="flex-grow mt-4" onClick={onCerrar}>
                {enlaces.filter(enlace => usuario.rol === RolUsuario.Admin || enlace.rol === RolUsuario.Usuario).map((enlace) => (
                    <ReactRouterDOM.Link
                        key={enlace.ruta}
                        to={enlace.ruta}
                        className={`flex items-center px-6 py-4 my-1 text-sm transition-all duration-200 ease-in-out hover:bg-tkd-red hover:text-white ${location.pathname === enlace.ruta ? 'bg-tkd-red text-white' : 'text-tkd-gray'} ${estaAbierta ? '' : 'justify-center'}`}
                        title={!estaAbierta ? enlace.texto : undefined}
                    >
                        <enlace.icono className="w-6 h-6" />
                        {estaAbierta && <span className="mx-4 font-medium">{enlace.texto}</span>}
                    </ReactRouterDOM.Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={onLogout} className={`flex items-center w-full px-4 py-2 text-sm text-tkd-gray hover:bg-tkd-red rounded-md transition-colors duration-200 ${!estaAbierta ? 'justify-center' : ''}`}>
                    <IconoLogout className="w-6 h-6" />
                    {estaAbierta && <span className="mx-4 font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
};


const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -15 },
};
const pageTransition: Transition = { duration: 0.25, ease: 'easeInOut' };

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="p-8 text-red-500">Error: Component failed to render</div>;
        }

        return this.props.children;
    }
}

const AppLayout: React.FC = () => {
    const { usuario, logout } = useAuth();
    const location = ReactRouterDOM.useLocation();
    const [menuAbierto, setMenuAbierto] = useState(window.innerWidth >= 768);
    const [busquedaAbierta, setBusquedaAbierta] = useState(false);
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    if(!usuario) return null; // No debería ocurrir gracias a RutaProtegida, pero es una salvaguarda.
    
    const toggleMenu = () => setMenuAbierto(!menuAbierto);
    const cerrarMenuSiMovil = () => {
        if(window.innerWidth < 768) {
            setMenuAbierto(false);
        }
    };


    return (
        <div className="relative md:flex h-screen bg-tkd-gray dark:bg-tkd-dark">
            {menuAbierto && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={cerrarMenuSiMovil}></div>}
            <BarraLateral usuario={usuario} onLogout={logout} estaAbierta={menuAbierto} onCerrar={cerrarMenuSiMovil} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 shadow-md z-20">
                    <button onClick={toggleMenu} className="p-2 rounded-full text-gray-500 hover:text-tkd-blue focus:outline-none dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <IconoMenu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={() => setBusquedaAbierta(true)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none transition-transform duration-200 hover:scale-110" aria-label="Abrir búsqueda global">
                           <IconoBuscar className="w-5 h-5"/>
                        </button>
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none transition-transform duration-200 hover:scale-110" aria-label="Cambiar tema de color">
                            {theme === 'light' ? <IconoLuna className="w-5 h-5"/> : <IconoSol className="w-5 h-5" />}
                        </button>
                        <div className="text-right">
                            <div className="font-semibold text-tkd-dark dark:text-white">{usuario.nombreUsuario}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{usuario.rol}</div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto" ref={scrollableContainerRef}>
                      <ErrorBoundary>
                         <ReactRouterDOM.Outlet />
                      </ErrorBoundary>
                 </div>
                <Footer />
            </main>
            <BotonVolverArriba scrollContainerRef={scrollableContainerRef} />
            <ModalBusquedaGlobal abierto={busquedaAbierta} onCerrar={() => setBusquedaAbierta(false)} />
        </div>
    );
};

// Componente para agrupar proveedores de datos
const AppLayoutWithData: React.FC = () => (
    <DataProvider>
        <AppLayout />
    </DataProvider>
);

// --- Componentes de Enrutamiento ---
const RutaProtegida: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { usuario, cargandoSesion } = useAuth();
    if (cargandoSesion) {
        return (
            <div className="flex items-center justify-center h-screen bg-tkd-blue text-white">
                <Loader texto="Inicializando..." />
            </div>
        );
    }
    if (!usuario) {
        return <ReactRouterDOM.Navigate to="/login" replace />;
    }
    return children;
};

const AppRoutes: React.FC = () => {
    const { usuario, cargandoSesion } = useAuth();

    if (cargandoSesion) {
        return (
            <div className="flex items-center justify-center h-screen bg-tkd-blue text-white">
                <Loader texto="Inicializando..." />
            </div>
        );
    }

    return (
        <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/login" element={usuario ? <ReactRouterDOM.Navigate to="/" replace /> : <Login />} />
            <ReactRouterDOM.Route path="/firma/:idEstudiante" element={<VistaFirmaConsentimiento />} />
            <ReactRouterDOM.Route path="/contrato/:idEstudiante" element={<VistaFirmaContrato />} />
            <ReactRouterDOM.Route path="/imagen/:idEstudiante" element={<VistaFirmaImagen />} />
            <ReactRouterDOM.Route path="/evento/:idEvento" element={<VistaEventPublico />} />
            <ReactRouterDOM.Route path="/tienda-publica" element={<VistaTiendaPublica />} />

            <ReactRouterDOM.Route element={<RutaProtegida><AppLayoutWithData /></RutaProtegida>}>
                <ReactRouterDOM.Route path="/" element={<VistaDashboard />} />
                <ReactRouterDOM.Route path="/estudiantes" element={<VistaEstudiantes />} />
                <ReactRouterDOM.Route path="/tienda" element={<VistaTienda />} />
                {/* <ReactRouterDOM.Route path="/events" element={<VistaEvents />} /> */} {/* DESHABILITADO TEMPORALMENTE */}
                <ReactRouterDOM.Route path="/notificaciones" element={<VistaNotificaciones />} />
                <ReactRouterDOM.Route path="/configuracion" element={<VistaConfiguracion />} />
            </ReactRouterDOM.Route>

            <ReactRouterDOM.Route path="*" element={<Vista404 />} />
        </ReactRouterDOM.Routes>
    );
};

const App: React.FC = () => {
    return (
        <ReactRouterDOM.HashRouter>
            <NotificacionProvider>
                <AuthProvider>
                    <NotificacionToast />
                    <AppRoutes />
                </AuthProvider>
            </NotificacionProvider>
        </ReactRouterDOM.HashRouter>
    );
};

export default App;