import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ChakraProvider theme={theme}>
         <AuthProvider>
          <App />
         </AuthProvider>
      
    </ChakraProvider>
  </StrictMode>,
)
