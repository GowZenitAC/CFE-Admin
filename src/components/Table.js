import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CButton
} from '@coreui/react';

// Usa parámetros por defecto directamente en la definición
export const ReusableCoreUITable = ({ data = [], columns = [] }) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4, // Número de filas por página (ajustable)
      },
    },
  });

  return (
    <>
    <CTable>
      <CTableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <CTableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <CTableHeaderCell key={header.id} scope="col">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        ))}
      </CTableHead>
      <CTableBody>
        {table.getRowModel().rows.map((row) => (
          <CTableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <CTableDataCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
    <CRow className="mt-3">
        <CCol className="d-flex justify-content-between align-items-center">
          <div>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div>
            <CButton
              color="primary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="me-2"
            >
              Anterior
            </CButton>
            <CButton
              color="primary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </CButton>
          </div>
        </CCol>
      </CRow>
    </>
  );
};

