import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App/App'
import { store } from './state/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { theme } from './theme/theme'
import { ThemeProvider } from '@mui/material'
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
