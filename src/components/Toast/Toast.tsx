import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={6000}
      closeOnClick={true}
      pauseOnFocusLoss={true}
      draggable={false}
      theme="dark"
    />
  )
}
