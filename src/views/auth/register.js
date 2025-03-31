import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import supabase from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  const validatePasswords = (pass, confirm) => {
    if (pass !== confirm) {
      setPasswordError('Las contraseñas no coinciden')
    } else {
      setPasswordError('')
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    validatePasswords(e.target.value, confirmPassword)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    validatePasswords(password, e.target.value)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const usernameLower = username.toLowerCase().trim()
    const fakeEmail = `${usernameLower}@cfe.com.mx`

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      // 1. Verificar username único
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .ilike('username', usernameLower)

      if (count > 0) {
        throw new Error('El nombre de usuario ya está registrado')
      }

      // 2. Registrar usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
      })

      if (error) throw error

      // 3. Insertar en tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          username: usernameLower,
          full_name: fullname.trim()
        })

      if (profileError) throw profileError

      setUsername('')
      setFullname('')
      setPassword('')
      setConfirmPassword('')
      
      alert('¡Registro exitoso! Por favor verifica tu email')
      navigate('/login')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="username" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Fullname" autoComplete="fullname" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      value={password}
                      onChange={handlePasswordChange}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  {passwordError && <div className="text-danger mb-3">{passwordError}</div>}
                  <div className="d-grid">
                    <CButton type='submit' disabled={loading} color="success">{loading ? 'Registering...' : 'Register'}</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
