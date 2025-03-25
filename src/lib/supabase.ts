import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'present' : 'missing',
      anonKey: supabaseAnonKey ? 'present' : 'missing'
    })
    throw new Error('Missing Supabase environment variables')
  }

  const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  // Test the connection
  client.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connected successfully', {
        authenticated: !!session,
        userId: session?.user?.id
      })
    }
  })

  return client
} 