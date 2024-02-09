import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import api from "@/utils/api"
import { ChevronLeft, HardDrive } from "lucide-react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"

interface QuestionsProps {
    id: string
    descricao: string
}

interface QuizProps {
    id: string
    nome: string
    descricao: string
    perguntas: QuestionsProps[]
}

const answerSchema = z.object({
    question_id: z.string().uuid(),
    descricao: z.string()
})

type AnserFormData = z.infer<typeof answerSchema>

export function AnswerQuiz() {
    const { quizId } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { handleSubmit, register } = useForm<AnserFormData>()

    const { data, isLoading } = useQuery(['quiz', quizId], async () => {
        const response = await api.get<QuizProps>(`/quizzes/${quizId}`, {
            params: {
                loadQuestions: true,
            }
        })

        return response.data
    })

    async function onSubmit(data: AnserFormData) {
        const response = await api.post(`/quizzes/${quizId}/answers`, data)
        
        if(response.data) {
            toast({
                title: 'Respondido com sucesso!',
            })
        }
    }

    return (
        <div className="p-8">
            <div className="mb-4">
                <Button size="sm" onClick={() => navigate(-1)}><ChevronLeft size={14} className="mr-2" /> Voltar</Button>
            </div>
            {
                isLoading ? <div>Carregando...</div> : (
                    <>
                        <span className="font-mono">Questionário</span>
                        <h1 className="text-2xl font-bold mb-6">{data?.nome}</h1>
                        <div className="mt-8 space-y-4">
                            {
                                data?.perguntas.map((pergunta, index) => (
                                    <Card key={pergunta.id}>
                                        <CardHeader>
                                            <CardTitle>{index} - {pergunta.descricao}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <span className="text-xs block mb-2">Resposta:</span>
                                                <input type="hidden" value={pergunta.id} {...register('question_id')} />
                                                <Input placeholder="resposta..." {...register('descricao')} />
                                                <div className="flex justify-end mt-4">
                                                    <Button>Responder</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                            {data?.perguntas.length === 0 && (
                                <Card>
                                    <CardContent className="flex items-center justify-center">
                                        <span className="font-mono text-muted-foreground">
                                            <HardDrive size={16} className="mr-4" />
                                            Nenhum pergunta cadastrada ao questionario!
                                        </span>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    )
}