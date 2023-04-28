import type { ReactNode } from 'react'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getToken } from './utils/auth'
import { useAuthDispatch, useAuthState } from '~/context/AuthContext'
import type { ProtectedRouteProps } from '~/components/ProtectedRoute'

import ProtectedRoute from '~/components/ProtectedRoute'
const Home = lazy(() => import('~/pages/home'))
const Login = lazy(() => import('~/pages/login'))
const UserInfo = lazy(() => import('~/pages/userInfo'))
const Page404 = lazy(() => import('~/layouts/404'))
interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
}

const LazyLoad = ({ children, fallback = <div>Loading...</div> }: LazyLoadProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
)
interface routeType {
  path: string
  element: JSX.Element
  isProtectedRoute: Boolean
}

const routes: routeType[] = [
  {
    path: '/',
    element: <LazyLoad><Home /></LazyLoad>,
    isProtectedRoute: true,
  },
  {
    path: '/:username',
    element: <LazyLoad><Home /></LazyLoad>,
    isProtectedRoute: true,
  },
  {
    path: 'userinfo',
    element: <LazyLoad><UserInfo /></LazyLoad>,
    isProtectedRoute: true,
  },
  {
    path: 'login',
    element: <LazyLoad><Login /></LazyLoad>,
    isProtectedRoute: false,
  },
  {
    path: '*',
    element: <LazyLoad><Page404 /></LazyLoad>,
    isProtectedRoute: false,
  },
]

const APP = () => {
  const { redirectPath } = useAuthState()
  const authenticated = !!getToken()
  const dispatch = useAuthDispatch()
  const setRedirectPath = (path: string) => {
    dispatch({ type: 'SET_REDIRECT_PATH', payload: path })
  }
  if (!redirectPath)
    setRedirectPath('/')

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    authenticated,
    authenticationPath: '/login',
    redirectPath,
    setRedirectPath,
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routes.map(r => (
            <Route path={r.path} element={r.isProtectedRoute ? <ProtectedRoute {...defaultProtectedRouteProps} outlet={r.element} /> : r.element} key={r.path} />
          ))}
        </Routes>
      </BrowserRouter>

    </div>

  )
}

export default APP
