import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// redux
import { Provider } from 'react-redux'
import { store } from '@/store'

// react-query
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/query/queryClient.ts"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
