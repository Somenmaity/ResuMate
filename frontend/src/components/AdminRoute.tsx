import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken')
  if (!token) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default AdminRoute
