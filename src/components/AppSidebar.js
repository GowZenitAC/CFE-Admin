import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CImage } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import { sygnet } from 'src/assets/brand/sygnet'
import logo from '../assets/brand/cfelogo.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={{
          display: 'flex',
          justifyContent: 'center', // Centrar horizontalmente todo el contenido
          alignItems: 'center', // Centrar verticalmente
          position: 'relative', // Para posicionar el CCloseButton
          padding: '10px 0', // Ajustar el padding para más espacio
        }}>
        <CSidebarBrand to="/" style={{
            display: 'flex',
            justifyContent: 'center', // Centrar horizontalmente
            alignItems: 'center', // Centrar verticalmente
            width: '100%', // Asegurarse de que ocupe todo el ancho disponible
          }}>
          <CImage src={logo} height={120} width={120} fluid={true} style={{ objectFit: 'contain'}}/>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
