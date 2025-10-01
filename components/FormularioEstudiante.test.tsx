// components/FormularioEstudiante.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificacionProvider } from '../context/NotificacionContext';
// FIX: Added 'expect' to the import from '@jest/globals' to resolve type inference issues with jest-dom matchers.
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import FormularioEstudiante from './FormularioEstudiante';
import { GrupoEdad, EstadoPago, type Estudiante } from '../tipos';

// Mock del hook de autosave
jest.mock('../hooks/useAutosave', () => ({
  useAutosave: () => ({
    status: 'idle',
    hasDraft: false,
    restoreDraft: jest.fn(),
    clearDraft: jest.fn(),
  }),
}));

describe('FormularioEstudiante', () => {
  const onGuardarMock = jest.fn<(estudiante: Estudiante) => Promise<void>>().mockResolvedValue();
  const onCerrarMock = jest.fn();

  const renderComponent = (props: Partial<React.ComponentProps<typeof FormularioEstudiante>> = {}) => {
    const defaultProps: React.ComponentProps<typeof FormularioEstudiante> = {
      abierto: true,
      onCerrar: onCerrarMock,
      onGuardar: onGuardarMock,
      estudianteActual: null,
      cargando: false,
    };
    return render(
      <NotificacionProvider>
        <FormularioEstudiante {...defaultProps} {...props} />
      </NotificacionProvider>
    );
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario para un nuevo estudiante', () => {
    renderComponent();
    expect(screen.getByText('Agregar Nuevo Estudiante')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres/i)).toHaveValue('');
  });

  it('renderiza el formulario con los datos de un estudiante existente', () => {
    const estudianteActual: Estudiante = {
      id: '1',
      nombres: 'Ana',
      apellidos: 'García',
      numeroIdentificacion: '12345',
      fechaNacimiento: '2010-01-01',
      grupo: GrupoEdad.Precadetes,
      estadoPago: EstadoPago.AlDia,
      fechaIngreso: '2022-01-01',
      saldoDeudor: 0,
      historialPagos: [],
      consentimientoInformado: false,
      contratoServiciosFirmado: false,
      consentimientoImagenFirmado: false,
      consentimientoFotosVideos: false,
      telefono: '',
      correo: '',
    };
    renderComponent({ estudianteActual });
    
    expect(screen.getByText('Editar Estudiante')).toBeInTheDocument();
    const nombresInput = screen.getByRole('textbox', { name: /^Nombres$/i });
    const apellidosInput = screen.getByRole('textbox', { name: /^Apellidos$/i });
    expect(nombresInput).toHaveValue('Ana');
    expect(apellidosInput).toHaveValue('García');
  });

  it('muestra la sección del tutor si el estudiante es menor de edad', async () => {
    renderComponent();

    const fechaNacimientoInput = screen.getByLabelText(/Fecha de Nacimiento/i);
    // Fecha que lo hace menor de 18
    fireEvent.change(fechaNacimientoInput, { target: { value: '2015-01-01' } });

    await waitFor(() => {
        expect(screen.getByText(/Datos del Tutor \(Obligatorio\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombres del Tutor/i)).toBeInTheDocument();
    });
  });

  it('valida campos requeridos y habilita el botón de guardar', async () => {
    renderComponent();

    const guardarBtn = screen.getByRole('button', { name: /Guardar Estudiante/i });
    expect(guardarBtn).toBeDisabled();

    // Llenar campos requeridos para un mayor de edad
    fireEvent.change(screen.getByLabelText(/Nombres/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/Número de Identificación/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan.perez@test.com' } });

    await waitFor(() => {
        expect(guardarBtn).toBeEnabled();
    });
  });

  it('llama a onGuardar con los datos correctos al enviar el formulario', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nombres/i), { target: { value: 'Carlos' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'Ruiz' } });
    fireEvent.change(screen.getByLabelText(/Número de Identificación/i), { target: { value: '78910' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '2001-01-01' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'carlos.ruiz@test.com' } });

    const guardarBtn = screen.getByRole('button', { name: /Guardar Estudiante/i });

    await waitFor(() => expect(guardarBtn).toBeEnabled());
    fireEvent.click(guardarBtn);

    await waitFor(() => {
      expect(onGuardarMock).toHaveBeenCalledTimes(1);
      expect(onGuardarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nombres: 'Carlos',
          apellidos: 'Ruiz',
          numeroIdentificacion: '78910',
        })
      );
    });
  });
});