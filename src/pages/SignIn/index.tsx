import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SignInFormData, useAuth } from "@/contexts/Auth";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export function SignInPage() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInFormData>()
    const { toast } = useToast()
    const { signIn } = useAuth()
    const navigate = useNavigate()
    
    async function onSubmit(data: SignInFormData) {
        try {
            await signIn(data)

            navigate('/app/quizzes')

            toast({
                title: 'Login efetuado com sucesso!',
            })
        } catch (error) {
            if(axios.isAxiosError(error)) {
                toast({
                    title: error?.response?.data.message ?? 'Houver um error ao se autenticar',
                })
            }
        }
    }

    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <Card>
            <CardHeader>
                <CardTitle>Efetuar login</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register('cpf')} placeholder="CPF" />
                    <Input {...register('senha')} placeholder="Senha" type="password" />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>Entrar</Button>
                </form>
            </CardContent>
            </Card>
        </div>
    )
}