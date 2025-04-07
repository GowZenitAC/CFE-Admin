import { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CFormSelect,
  CButton,
  CModal, // Importar CModal para el zoom
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react';
import { ReusableCoreUITable } from '../../components/Table';
import { format } from '@formkit/tempo';
import { fetchVales, fetchSignature } from '../../lib/ValeService';
import supabase from '../../lib/supabase';

function Reports() {
  const [valesData, setValesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [signatureUrl, setSignatureUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false); // Estado para controlar el modal
  const [selectedImage, setSelectedImage] = useState(''); // Estado para la URL de la imagen seleccionada

  // Cargar los reportes y los usuarios al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener el usuario autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          // Obtener el username del usuario autenticado desde la tabla profiles
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          setCurrentUser(userProfile?.username || null);
        }

        // Cargar reportes (vales)
        const data = await fetchVales();
        setValesData(data);
        setFilteredData(data);

        if (data[0]?.signature_id) {
          const parseId = parseInt(data[0].signature_id, 10);
          const signature = await fetchSignature(parseId);
          setSignatureUrl(signature[0].signature_url);
        }

        // Cargar usuarios desde la tabla profiles
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, username')
          .order('username', { ascending: true });

        if (usersError) throw usersError;

        // Filtrar para excluir al usuario autenticado
        const filteredUsers = usersData?.filter(
          (user) => user.username !== currentUser
        ) || [];
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [currentUser]);

  // Filtrar los datos según el usuario seleccionado y el rango de fechas
  useEffect(() => {
    let filtered = valesData;

    // Filtrar por usuario seleccionado
    if (selectedUser) {
      filtered = filtered.filter((row) => row.profiles?.username === selectedUser);
    }

    // Filtrar por rango de fechas usando el campo created_at
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((row) => {
        // Asegurarnos de que row.created_at sea un valor válido
        if (!row.created_at) return false;

        // Convertir el timestamp created_at a un objeto Date
        const rowDate = new Date(row.created_at);
        if (isNaN(rowDate.getTime())) return false; // Si la fecha no es válida, excluir el registro

        // Extraer solo la parte de la fecha (YYYY-MM-DD) de created_at
        const rowDateStr = format(rowDate, 'YYYY-MM-DD');

        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        const startDateStr = startDate ? format(startDate, 'YYYY-MM-DD') : null;
        const endDateStr = endDate ? format(endDate, 'YYYY-MM-DD') : null;

        return (
          (!startDateStr || rowDateStr >= startDateStr) &&
          (!endDateStr || rowDateStr <= endDateStr)
        );
      });
    }

    setFilteredData(filtered);
  }, [selectedUser, dateRange, valesData]);

  // Función para resetear los filtros
  const resetFilters = () => {
    setSelectedUser(''); // Resetear el usuario seleccionado
    setDateRange({ start: '', end: '' }); // Resetear el rango de fechas
  };

  // Función para abrir el modal con la imagen seleccionada
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha',
      cell: (info) => {
        const date = new Date(info.getValue());
        return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'DD/MM/YYYY');
      },
    },
    {
      accessorKey: 'profiles.username',
      header: 'Usuario',
      cell: (info) => info.getValue() || 'Sin usuario',
    },
    {
      accessorKey: 'vale_url',
      header: 'Vale',
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="Vale"
          width="100px"
          height="100px"
          className="img-fluid"
          style={{ cursor: 'pointer' }} // Añadir cursor pointer para indicar que es clickable
          onClick={() => openImageModal(info.getValue())} // Abrir modal al hacer clic
        />
      ),
    },
    {
      accessorKey: 'signature_id',
      header: 'Firma',
      cell: (info) => (
        <img
          src={signatureUrl}
          alt="Firma"
          width="100px"
          height="100px"
          className="img-fluid"
          style={{ cursor: 'pointer' }} // Añadir cursor pointer para indicar que es clickable
          onClick={() => openImageModal(signatureUrl)} // Abrir modal al hacer clic
        />
      ),
    },
  ];

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Datos de reportes</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3 align-items-end g-3">
            <CCol xs={3}>
              <CFormLabel>Usuario</CFormLabel>
              <CFormSelect
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-100"
              >
                <option value="">Todos los usuarios</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={3}>
              <CFormLabel>Fecha Inicio</CFormLabel>
              <CFormInput
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="w-100"
              />
            </CCol>
            <CCol xs={3}>
              <CFormLabel>Fecha Fin</CFormLabel>
              <CFormInput
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="w-100"
              />
            </CCol>
            <CCol xs={3} className="d-flex align-items-end">
              <CButton
                color="secondary"
                onClick={resetFilters}
                className="w-100"
              >
                Resetear Filtros
              </CButton>
            </CCol>
          </CRow>
          <ReusableCoreUITable data={filteredData} columns={columns} />
        </CCardBody>
      </CCard>

      {/* Modal para mostrar la imagen ampliada */}
      <CModal
        visible={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="lg" // Tamaño grande para el modal
      >
        <CModalHeader>
          <CModalTitle>Vista previa de la imagen</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            style={{ width: '100%', height: 'auto' }} // La imagen ocupa el ancho completo del modal
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowImageModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CCol>
  );
}

export default Reports;