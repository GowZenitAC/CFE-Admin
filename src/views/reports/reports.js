import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCaretRight } from '@coreui/icons'
import { ReusableCoreUITable } from '../../components/Table'
import { format } from '@formkit/tempo'
import { fetchReports } from '../../lib/InspectionsService'
import { Link } from 'react-router-dom'

function Reports() {
  const [reportsData, setReportsData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports()
        setReportsData(data)
        setFilteredData(data)
      } catch (error) {
        // Error ya logueado en el servicio
      }
    }
    loadReports()
  }, [])

  useEffect(() => {
    let filtered = reportsData

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.fecha)
        const startDate = dateRange.start ? new Date(dateRange.start) : null
        const endDate = dateRange.end ? new Date(dateRange.end) : null

        const rowDateStr = format(rowDate, 'YYYY-MM-DD')
        const startDateStr = startDate ? format(startDate, 'YYYY-MM-DD') : null
        const endDateStr = endDate ? format(endDate, 'YYYY-MM-DD') : null

        return (
          (!startDateStr || rowDateStr >= startDateStr) && (!endDateStr || rowDateStr <= endDateStr)
        )
      })
    }

    setFilteredData(filtered)
  }, [searchTerm, dateRange, reportsData])

  const columns = [
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: (info) => format(info.getValue(), 'DD/MM/YYYY'),
    },
    {
      accessorKey: 'placas_vehiculo',
      header: 'Número de Placa',
    },
    {
      accessorKey: 'hora_inicio',
      header: 'Hora de Inicio',
      cell: (info) => {
        const timeString = info.getValue()
        const date = new Date(`1970-01-01T${timeString}Z`)
        return format(date, 'HH:mm:ss')
      },
    },
    {
      accessorKey: 'hora_finalizacion',
      header: 'Hora de Finalización',
      cell: (info) => {
        const timeString = info.getValue()
        const date = new Date(`1970-01-01T${timeString}Z`)
        return format(date, 'HH:mm:ss')
      },
    },
    {
      accessorKey: 'profiles.username',
      header: 'Usuario',
      cell: (info) => info.getValue() || 'Sin usuario',
    },
    {
      header: 'Detalles',
      cell: ({ row }) => (
        <Link to={`/reports/${row.original.id}`}>
        <CButton
          color="success"
          size="sm"
        >
          <CIcon icon={cilCaretRight} className="text-light" />
        </CButton>
        </Link>
      ),
    },
  ]

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Datos de reportes</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3 align-items-end g-3">
            <CCol xs={4}>
              <CFormLabel>Búsqueda</CFormLabel>
              <CFormInput
                type="text"
                placeholder="Buscar en la tabla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-100"
              />
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
            {/* <CCol xs={2} className="d-flex align-items-end">
              <CButton color="success" className="w-100">
                Agregar
              </CButton>
            </CCol> */}
          </CRow>
          <ReusableCoreUITable data={filteredData} columns={columns} />
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default Reports
