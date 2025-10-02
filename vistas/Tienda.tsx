// vistas/Tienda.tsx - Interfaz Unificada
import React, { useState, useEffect } from 'react';
import { useGestionTienda } from '../hooks/useGestionTienda';
import { useDashboard } from '../hooks/useDashboard';
import { useGestionEstudiantes } from '../hooks/useGestionEstudiantes';
import { useGestionEventos } from '../hooks/useGestionEventos';
import { useGestionNotificaciones } from '../hooks/useGestionNotificaciones';

// Componentes
import ModalSeleccionarEstudiante from '../components/ModalSeleccionarEstudiante';
import ModalCompartirTienda from '../components/ModalCompartirTienda';
import FiltrosTienda from '../components/FiltrosTienda';
import SolicitudesCompraPendientes from '../components/dashboard/SolicitudesCompraPendientes';
import FiltrosDashboard from '../components/dashboard/FiltrosDashboard';
import ResumenKPIs from '../components/dashboard/ResumenKPIs';
import ProximosEventos from '../components/dashboard/ProximosEventos';
import ResumenPagos from '../components/dashboard/ResumenPagos';
import AccesosDirectos from '../components/dashboard/AccesosDirectos';
import FiltrosEstudiantes from '../components/FiltrosEstudiantes';
import TablaEstudiantes from '../components/TablaEstudiantes';
import { TablaEstudiantesSkeleton } from '../components/skeletons/TablaEstudiantesSkeleton';
import FormularioEvento from '../components/FormularioEvento';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ToggleSwitch from '../components/ToggleSwitch';
import ModalCompartirEvento from '../components/ModalCompartirEvento';
import ModalGestionarSolicitudes from '../components/ModalGestionarSolicitudes';
import { IconoEnviar, IconoHistorial, IconoAprobar } from '../components/Iconos';
import TarjetaHistorial from '../components/TarjetaHistorial';
import { IconoCompartir, IconoCarritoAgregar, IconoTienda, IconoDashboard, IconoEstudiantes, IconoEventos, IconoCampana, IconoConfiguracion, IconoAgregar, IconoExportar } from '../components/Iconos';
import { formatearPrecio } from '../utils/formatters';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const VistaTienda: React.FC = () => {
  console.log('DEBUG: VistaTienda rendering');

  // Detectar tab desde la URL
  const currentPath = window.location.hash.replace('#', '') || '/';
  const getTabFromPath = (path: string): 'tienda' | 'dashboard' | 'estudiantes' | 'eventos' | 'notificaciones' | 'configuracion' => {
    console.log('DEBUG: getTabFromPath - currentPath:', path);
    if (path === '/' || path === '/dashboard' || path === '') return 'dashboard';
    if (path === '/estudiantes') return 'estudiantes';
    if (path === '/tienda') return 'tienda';
    if (path === '/eventos') return 'eventos';
    if (path === '/notificaciones') return 'notificaciones';
    if (path === '/configuracion') return 'configuracion';
    console.log('DEBUG: getTabFromPath - defaulting to tienda for path:', path);
    return 'tienda'; // default
  };

  const [activeTab, setActiveTab] = useState<'tienda' | 'dashboard' | 'estudiantes' | 'eventos' | 'notificaciones' | 'configuracion'>(getTabFromPath(currentPath));

  // Actualizar tab cuando cambia el hash
  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.replace('#', '') || '/';
      const newTab = getTabFromPath(newPath);
      console.log('DEBUG: Hash changed to:', newPath, 'setting tab to:', newTab);
      setActiveTab(newTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Hooks para todas las funcionalidades
  const tiendaData = useGestionTienda();
  const dashboardData = useDashboard();
  const estudiantesData = useGestionEstudiantes();
  const eventosData = useGestionEventos();
  const notificacionesData = useGestionNotificaciones();

  const {
    implementos,
    implementosFiltrados,
    cargando: cargandoTienda,
    error: errorTienda,
    cargarDatosTienda,
    estudiantes,
    cargandoEstudiantes,
    selecciones,
    handleSeleccionChange,
    modalAbierto,
    setModalAbierto,
    cargandoCompra,
    modalCompartirAbierto,
    setModalCompartirAbierto,
    compraSeleccionada,
    iniciarCompra,
    procesarCompra,
    filtroCategoria,
    setFiltroCategoria,
    filtroPrecio,
    setFiltroPrecio,
    limpiarFiltros,
  } = tiendaData;

  const renderContent = () => {
    if (cargandoTienda) return <div className="flex justify-center items-center h-full p-8"><Loader texto="Cargando implementos..." /></div>;
    if (errorTienda) return <ErrorState mensaje={errorTienda} onReintentar={cargarDatosTienda} />;
    
    if (implementos.length === 0) {
      return <EmptyState Icono={IconoTienda} titulo="Tienda Vacía" mensaje="Actualmente no hay implementos disponibles para la venta." />;
    }

    if (implementosFiltrados.length === 0) {
      return <EmptyState Icono={IconoTienda} titulo="Sin Resultados" mensaje="Ningún implemento coincide con los filtros seleccionados. Intenta con otros valores." />;
    }

    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {implementosFiltrados.map(implemento => {
          const variacionSeleccionada = implemento.variaciones.find(v => v.id === selecciones[implemento.id]);
          return (
            <div key={implemento.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
              <img src={implemento.imagenUrl} alt={implemento.nombre} className="w-full h-48 object-contain p-5" />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-tkd-dark dark:text-white">{implemento.nombre}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1 flex-grow mb-4">{implemento.descripcion}</p>
                <div className="mt-auto space-y-3">
                   <select 
                      id={`select-${implemento.id}`} 
                      value={selecciones[implemento.id] || ''} 
                      onChange={(e) => handleSeleccionChange(implemento.id, e.target.value)} 
                      className="block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-tkd-blue focus:border-tkd-blue sm:text-sm text-tkd-dark transition-colors"
                      aria-label={`Selecciona una variación para ${implemento.nombre}`}
                    >
                      <option value="" disabled>-- Elige una opción --</option>
                      {implemento.variaciones.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.descripcion} ({v.precio > 0 ? formatearPrecio(v.precio) : 'Consultar'})
                        </option>
                      ))}
                    </select>
                  <button onClick={() => iniciarCompra(implemento, selecciones[implemento.id])} disabled={!variacionSeleccionada || variacionSeleccionada.precio <= 0} className="w-full bg-tkd-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2 shadow-sm hover:shadow-md">
                      <IconoCarritoAgregar className="w-5 h-5"/><span>Asignar Compra</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const tabs = [
    { id: 'tienda' as const, label: 'Tienda', icon: IconoTienda },
    { id: 'dashboard' as const, label: 'Dashboard', icon: IconoDashboard },
    { id: 'estudiantes' as const, label: 'Estudiantes', icon: IconoEstudiantes },
    { id: 'eventos' as const, label: 'Eventos', icon: IconoEventos },
    { id: 'notificaciones' as const, label: 'Alertas', icon: IconoCampana },
    { id: 'configuracion' as const, label: 'Configuración', icon: IconoConfiguracion },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tienda':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <h2 className="text-2xl font-bold text-tkd-dark dark:text-white">Tienda de Implementos</h2>
              <button onClick={() => setModalCompartirAbierto(true)} className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 shadow-md hover:shadow-lg">
                <IconoCompartir className="w-5 h-5" /><span>Compartir Tienda</span>
              </button>
            </div>

            <FiltrosTienda
              filtroCategoria={filtroCategoria}
              setFiltroCategoria={setFiltroCategoria}
              filtroPrecio={filtroPrecio}
              setFiltroPrecio={setFiltroPrecio}
              limpiarFiltros={limpiarFiltros}
            />

            {renderContent()}
          </div>
        );

      case 'dashboard':
        return <div className="text-center py-8">Dashboard - Funcionalidad próximamente</div>;

      case 'estudiantes':
        return <div className="text-center py-8">Gestión de Estudiantes - Funcionalidad próximamente</div>;

      case 'eventos':
        return <div className="text-center py-8">Gestión de Eventos - Funcionalidad próximamente</div>;

      case 'notificaciones':
        return <div className="text-center py-8">Sistema de Notificaciones - Funcionalidad próximamente</div>;

      case 'configuracion':
        return <div className="text-center py-8">Panel de Configuración - Funcionalidad próximamente</div>;

      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  return (
    <div className="p-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-tkd-blue text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Modals */}
      {modalAbierto && compraSeleccionada && (
        (() => {
          console.log('VistaTienda - Pasando estudiantes al modal:', estudiantes.map(e => ({ id: e.id, nombre: `${e.nombres} ${e.apellidos}` })));
          return <ModalSeleccionarEstudiante abierto={modalAbierto} titulo={`Asignar Compra a Estudiante`} textoBotonConfirmar="Confirmar Compra" onCerrar={() => setModalAbierto(false)} onConfirmar={procesarCompra} cargandoConfirmacion={cargandoCompra} estudiantes={estudiantes} cargandoEstudiantes={cargandoEstudiantes} />;
        })()
      )}
      {modalCompartirAbierto && <ModalCompartirTienda abierto={modalCompartirAbierto} onCerrar={() => setModalCompartirAbierto(false)} />}
    </div>
  );
};

export default VistaTienda;