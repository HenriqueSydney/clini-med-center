'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export function ToastHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const operation = searchParams.get('operation')
    if (operation) {
      const type = operation === 'ok' ? 'success' : 'error'
      toast(searchParams.get('result'), {
        type,
      })
    }
  }, [searchParams])

  return null
}
