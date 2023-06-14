import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './APP'
import SearchProvider from '~/context/SearchContext'
import AuthProvider from '~/context/AuthContext'
import RelationshipProvider from '~/context/RelationshipContext'
import '~/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RelationshipProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </RelationshipProvider>
    </AuthProvider>
  </React.StrictMode>,
)
