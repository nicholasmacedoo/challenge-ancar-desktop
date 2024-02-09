import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../utils/api'
import { z } from 'zod'
import { redirect } from 'react-router-dom'

interface AuthProviderProps {
  children: ReactNode
}

export const createSignInFormSchema = z.object({
  cpf: z.string(),
  senha: z.string().min(3, 'A Senha precisa de no mínimo 3 caracteres'),
})

export type SignInFormData = z.infer<typeof createSignInFormSchema>

export interface IUser {
  id: string
  nome: string
  cpf: string
  created_at: string
  updated_at: string
}

interface ISession {
  token: string
  user: IUser
}

interface AuthContextProps {
  user?: IUser
  signIn: (siginData: SignInFormData) => Promise<void>
  signOut: (isRedirect?: boolean) => void
}

const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<ISession | undefined>(() => {
    const token = localStorage.getItem('@ancar-challenge:token')
    const user = localStorage.getItem('@ancar-challenge:user')

    if (token && user) {
      return { token, user: JSON.parse(user) }
    }

    return undefined
  })

  async function signIn(data: SignInFormData) {
    try {
      const { cpf, senha } = createSignInFormSchema.parse(data)

      const response = await api.post('/sessions', { cpf, senha })
      const { token, user } = response.data

      localStorage.setItem('@ancar-challenge:token', token)
      localStorage.setItem('@ancar-challenge:user', JSON.stringify(user))

      setData({ token, user })
    } catch {
      throw new Error('Cpf/Senha não parece válidos.')
    }
  }

  function signOut(isRedirect: boolean = false) {
    localStorage.removeItem('@ancar-challenge:token')
    localStorage.removeItem('@ancar-challenge:user')
    setData(undefined)
    if (isRedirect) redirect('/')
  }

  return (
    <AuthContext.Provider value={{ user: data?.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  // const { signIn, signOut } = context;
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
