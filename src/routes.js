import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Reports = React.lazy(() => import('./views/reports/reports'))
const ReportDetails = React.lazy(() => import('./views/reports/ReportDetails'))
const Vales = React.lazy(() => import('./views/vales/vales'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/reports', name: 'Reports', element: Reports },
  { path: '/reports/:id', name: 'Report Details', element: ReportDetails },
  { path: '/vales', name: 'Vales', element: Vales },
]

export default routes
