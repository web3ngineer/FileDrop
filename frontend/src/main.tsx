import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import  store  from './stores/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './contexts/AuthContext'
import { Home, Login, Register} from './pages/pages.ts'
import { Dashboard, DashboardLayout, Files, Profile, Settings } from './pages/dashboard/page.ts'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import ErrorPage from './pages/Error.tsx'
import { Toaster } from 'sonner'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: 
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "files",
            element: <Files />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage/>
      }
    ]
  },
])



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
        <Toaster/>
      </Provider>
    </AuthContextProvider>
  </StrictMode>
)

