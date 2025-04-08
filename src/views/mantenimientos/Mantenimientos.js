import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CAlert,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilWarning } from '@coreui/icons';
import supabase from '../../lib/supabase'; // Ajusta la ruta a tu archivo de configuración de Supabase

const VehicleMileageList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]); // Para almacenar alertas de mantenimiento
  const MAINTENANCE_THRESHOLD = 10000; // Umbral de kilómetros para mantenimiento (ajustable)

  useEffect(() => {
    const fetchVehiclesMileage = async () => {
      try {
        // Obtener todas las placas únicas
        const { data: placasData, error: placasError } = await supabase
          .from('inspections')
          .select('placas_vehiculo')
          .order('placas_vehiculo', { ascending: true });

        if (placasError) throw placasError;

        // Eliminar duplicados y preparar lista de placas
        const uniquePlacas = [...new Set(placasData.map((item) => item.placas_vehiculo))];

        // Consultar los kilómetros recorridos por cada placa
        const mileagePromises = uniquePlacas.map(async (placa) => {
          const { data, error } = await supabase
            .from('inspections')
            .select('kilometraje_inicio, kilometraje_final')
            .eq('placas_vehiculo', placa);

          if (error) throw error;

          // Calcular los kilómetros recorridos
          const kilometrosRecorridos = data.reduce(
            (total, record) =>
              total + (record.kilometraje_final - record.kilometraje_inicio || 0),
            0
          );

          return { placa: placa, kilometros: kilometrosRecorridos };
        });

        const vehiclesData = await Promise.all(mileagePromises);
        setVehicles(vehiclesData);

        // Generar alertas para vehículos que necesiten mantenimiento
        const newAlerts = vehiclesData
          .filter((vehicle) => vehicle.kilometros >= MAINTENANCE_THRESHOLD)
          .map((vehicle) => ({
            placa: vehicle.placa,
            kilometros: vehicle.kilometros,
          }));
        setAlerts(newAlerts);

      } catch (error) {
        console.error('Error fetching vehicle mileage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclesMileage();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" /> <span>Cargando...</span>
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
            <strong>
              <CIcon icon={cilCarAlt} className="me-2" />
              Kilometraje por Vehículo
            </strong>
            {/* <CButton color="light" size="sm" onClick={() => navigate('/reports')}>
              Volver a Reportes
            </CButton> */}
          </CCardHeader>
          <CCardBody>
            {/* Mostrar alertas si hay vehículos que necesitan mantenimiento */}
            {alerts.length > 0 && (
              <div className="mb-4">
                {alerts.map((alert) => (
                  <CAlert key={alert.placa} color="warning" className="d-flex align-items-center">
                    <CIcon icon={cilWarning} className="me-2" />
                    El vehículo con placa: <strong>{alert.placa}</strong> ha recorrido{' '}
                    <strong>{alert.kilometros.toLocaleString()} km</strong> y necesita mantenimiento.
                  </CAlert>
                ))}
              </div>
            )}

            {/* Tabla de placas y kilometraje */}
            <CTable responsive bordered hover>
              <thead>
                <CTableRow>
                  <CTableHeaderCell>Placa del Vehículo</CTableHeaderCell>
                  <CTableHeaderCell>Kilómetros Recorridos</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {vehicles.map((vehicle) => (
                  <CTableRow key={vehicle.placa}>
                    <CTableDataCell>{vehicle.placa}</CTableDataCell>
                    <CTableDataCell>{vehicle.kilometros.toLocaleString()} km</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default VehicleMileageList;