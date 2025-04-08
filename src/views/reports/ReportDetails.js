import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
} from '@coreui/react';
import { format } from '@formkit/tempo';
import { fetchDetailInspection, fetchSignature } from '../../lib/InspectionsService'; // Ajusta la ruta
import CIcon from '@coreui/icons-react';
import { cilInfo, cilCarAlt, cilLightbulb, cilDrop, cilArrowLeft, cilPenNib } from '@coreui/icons';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null); // Estado para la URL de la firma

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchDetailInspection(id);
        setReport(data); // Ajustado para asignar directamente los datos
        if (data.user_signature_id) {
          const signatureData = await fetchSignature(data.user_signature_id);
          console.log(signatureData.signature_url);
          setSignatureUrl(signatureData.signature_url); // Asignar la URL de la firma al estado
        }
      } catch (error) {
        console.error('Error loading report:', error);
      }
    };
    loadReport();
  }, [id]);

  if (!report) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" /> <span>Cargando...</span>
      </div>
    );
  }

  // Calcular los kilómetros recorridos en este reporte
  const kilometrosRecorridos = report.kilometraje_final && report.kilometraje_inicio
    ? (report.kilometraje_final - report.kilometraje_inicio).toLocaleString()
    : 'N/A';

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
            <strong>
              <CIcon icon={cilInfo} className="me-2" />
              Detalles del Reporte #{report.id}
            </strong>
            <CButton color="light" size="sm" onClick={() => navigate('/reports')}>
              <CIcon icon={cilArrowLeft} className="me-2" />
              Volver
            </CButton>
          </CCardHeader>
          <CCardBody>
            {/* Información General */}
            <h5 className="mb-3">
              <CIcon icon={cilInfo} className="me-2 text-primary" />
              Información General
            </h5>
            <CTable responsive bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableDataCell>{report.id}</CTableDataCell>
                  <CTableHeaderCell>Usuario</CTableHeaderCell>
                  <CTableDataCell>{report.profiles?.username || 'Sin usuario'}</CTableDataCell>
                  <CTableHeaderCell>Signature ID</CTableHeaderCell>
                  <CTableDataCell>{report.user_signature_id}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableDataCell>{format(report.fecha, 'DD/MM/YYYY')}</CTableDataCell>
                  <CTableHeaderCell>Hora Inicio</CTableHeaderCell>
                  <CTableDataCell>{format(new Date(`1970-01-01T${report.hora_inicio}Z`), 'HH:mm:ss')}</CTableDataCell>
                  <CTableHeaderCell>Hora Finalización</CTableHeaderCell>
                  <CTableDataCell>{format(new Date(`1970-01-01T${report.hora_finalizacion}Z`), 'HH:mm:ss')}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Placas Vehículo</CTableHeaderCell>
                  <CTableDataCell>{report.placas_vehiculo}</CTableDataCell>
                  <CTableHeaderCell>Kilometraje Inicio</CTableHeaderCell>
                  <CTableDataCell>{report.kilometraje_inicio?.toLocaleString() || 'N/A'}</CTableDataCell>
                  <CTableHeaderCell>Kilometraje Fin</CTableHeaderCell>
                  <CTableDataCell>{report.kilometraje_final?.toLocaleString() || 'N/A'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Kilómetros Recorridos</CTableHeaderCell>
                  <CTableDataCell>{kilometrosRecorridos}</CTableDataCell>
                  <CTableHeaderCell colSpan="2">Observaciones</CTableHeaderCell>
                  <CTableDataCell colSpan="2">{report.observaciones || 'N/A'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {report.user_signature_id && (
              <div className="mt-4">
                <h5 className="mb-3">
                  <CIcon icon={cilPenNib} className="me-2 text-primary" />
                  Firma del Usuario
                </h5>
                {signatureUrl ? (
                  <div className="border rounded p-3 bg-light d-flex justify-content-center">
                    <img
                      src={signatureUrl}
                      alt="Firma del usuario"
                      style={{ maxWidth: '300px', maxHeight: '150px', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <p className="text-muted">Cargando firma...</p>
                )}
              </div>
            )}

            {/* Estado del Vehículo */}
            <h5 className="mb-3 mt-4">
              <CIcon icon={cilCarAlt} className="me-2 text-primary" />
              Estado del Vehículo
            </h5>
            <CTable responsive bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Viseras</CTableHeaderCell>
                  <CTableDataCell>{report.viseras}</CTableDataCell>
                  <CTableHeaderCell>Espejo Interior</CTableHeaderCell>
                  <CTableDataCell>{report.espejo_interior}</CTableDataCell>
                  <CTableHeaderCell>Espejo Lateral</CTableHeaderCell>
                  <CTableDataCell>{report.espejo_lateral}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Cristales Puerta</CTableHeaderCell>
                  <CTableDataCell>{report.cristales_puerta}</CTableDataCell>
                  <CTableHeaderCell>Parabrisas</CTableHeaderCell>
                  <CTableDataCell>{report.parabrisas}</CTableDataCell>
                  <CTableHeaderCell>Elevadores Cristales</CTableHeaderCell>
                  <CTableDataCell>{report.elevadores_cristales}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Cerraduras</CTableHeaderCell>
                  <CTableDataCell>{report.cerraduras}</CTableDataCell>
                  <CTableHeaderCell>Cinturón Seguridad</CTableHeaderCell>
                  <CTableDataCell>{report.cinturon_seguridad}</CTableDataCell>
                  <CTableHeaderCell>Volante</CTableHeaderCell>
                  <CTableDataCell>{report.volánsito}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {/* Luces */}
            <h5 className="mb-3 mt-4">
              <CIcon icon={cilLightbulb} className="me-2 text-primary" />
              Luces
            </h5>
            <CTable responsive bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Delanteras</CTableHeaderCell>
                  <CTableDataCell>{report.luces_delanteras}</CTableDataCell>
                  <CTableHeaderCell>Cuartos</CTableHeaderCell>
                  <CTableDataCell>{report.cuartos}</CTableDataCell>
                  <CTableHeaderCell>Frenos</CTableHeaderCell>
                  <CTableDataCell>{report.luces_frenos}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Direccionales</CTableHeaderCell>
                  <CTableDataCell>{report.luces_direccionales}</CTableDataCell>
                  <CTableHeaderCell>Intermitentes</CTableHeaderCell>
                  <CTableDataCell>{report.luces_intermitentes}</CTableDataCell>
                  <CTableHeaderCell>Reflejantes</CTableHeaderCell>
                  <CTableDataCell>{report.luces_reflejantes ? 'Sí' : 'No'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {/* Frenos y Fluidos */}
            <h5 className="mb-3 mt-4">
              <CIcon icon={cilDrop} className="me-2 text-primary" />
              Frenos y Fluidos
            </h5>
            <CTable responsive bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Freno Pie</CTableHeaderCell>
                  <CTableDataCell>{report.freno_pie}</CTableDataCell>
                  <CTableHeaderCell>Freno Mano</CTableHeaderCell>
                  <CTableDataCell>{report.freno_mano}</CTableDataCell>
                  <CTableHeaderCell>Líquido Frenos</CTableHeaderCell>
                  <CTableDataCell>{report.liquido_frenos}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Nivel Aceite Motor</CTableHeaderCell>
                  <CTableDataCell>{report.nivel_aceite_motor}</CTableDataCell>
                  <CTableHeaderCell>Nivel Aceite Transmisión</CTableHeaderCell>
                  <CTableDataCell>{report.nivel_aceite_trans}</CTableDataCell>
                  <CTableHeaderCell>Litros Gasolina Gastada</CTableHeaderCell>
                  <CTableDataCell>{report.litros_gasolina_gastada || 'N/A'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {/* Otros */}
            <h5 className="mb-3 mt-4">
              <CIcon icon={cilCarAlt} className="me-2 text-primary" />
              Otros
            </h5>
            <CTable responsive bordered hover>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Llantas</CTableHeaderCell>
                  <CTableDataCell>{report.llantas}</CTableDataCell>
                  <CTableHeaderCell>Limpieza Vehículo</CTableHeaderCell>
                  <CTableDataCell>{report.limpieza_vehiculo}</CTableDataCell>
                  <CTableHeaderCell>Botiquín</CTableHeaderCell>
                  <CTableDataCell>{report.botiquin ? 'Sí' : 'No'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Extintor</CTableHeaderCell>
                  <CTableDataCell>{report.extintor ? 'Sí' : 'No'}</CTableDataCell>
                  <CTableHeaderCell>Gato Hidráulico</CTableHeaderCell>
                  <CTableDataCell>{report.gato_hidraulico ? 'Sí' : 'No'}</CTableDataCell>
                  <CTableHeaderCell>Cruceta</CTableHeaderCell>
                  <CTableDataCell>{report.cruceta ? 'Sí' : 'No'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Lámpara Mano</CTableHeaderCell>
                  <CTableDataCell>{report.lampara_mano ? 'Sí' : 'No'}</CTableDataCell>
                  <CTableHeaderCell>Cables Pasacorriente</CTableHeaderCell>
                  <CTableDataCell>{report.cables_pasacorriente ? 'Sí' : 'No'}</CTableDataCell>
                  <CTableHeaderCell>Llanta Refacción</CTableHeaderCell>
                  <CTableDataCell>{report.llanta_refaccion ? 'Sí' : 'No'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ReportDetails;