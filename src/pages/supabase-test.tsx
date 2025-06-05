import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseTest() {
  const [status, setStatus] = useState('로딩 중...')

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('posts').select().limit(1)
      if (error) {
        setStatus(`연결 실패: ${error.message}`)
      } else {
        setStatus('Supabase 연결 성공!')
      }
    }

    testConnection()
  }, [])

  return <div>{status}</div>
}