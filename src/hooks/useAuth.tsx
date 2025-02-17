import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error('Erro ao obter usuário:', error.message)
            }

            setUser(data?.user || null)
            setLoading(false)
        }

        fetchUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            sessionStorage.setItem("session", event);
            setUser(session?.user || null)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return { user, loading }
}
