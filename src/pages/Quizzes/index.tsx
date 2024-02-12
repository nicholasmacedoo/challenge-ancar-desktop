import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/Auth"
import { useQueryPagination } from "@/hooks/use-query-pagination"
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react"
import { Link } from "react-router-dom"

const URL_API = import.meta.env.VITE_API_URL + '/quizzes'

interface IQuizzes {
    id: string
    nome: string
    descricao: string
}

export function QuizzesPage() {
    const { signOut } = useAuth()
    const { data, isLoading, count, limit, nextPage, previousPage } = useQueryPagination<IQuizzes>({
        queryKey: 'quizzes',
        url: URL_API,
    })

    const enabledNext = count > limit 

    return ( 
        <div className="p-8">
            <div className="flex justify-end">
                <Button onClick={() => signOut()}>Sair</Button>
            </div>
            <h1 className="text-2xl font-bold mb-6">Quizzes</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map(value => (
                        <TableRow>
                            <TableCell>{value.nome}</TableCell>
                            <TableCell>{value.descricao}</TableCell>
                            <TableCell>
                                <Button asChild>
                                    <Link to={`/app/quizzes/${value.id}`}>
                                        <Pencil size={16} />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div>
                {
                    enabledNext && (
                        <div className="flex justify-end gap-6 mt-6">
                            <Button onClick={previousPage}>
                                <ChevronLeft size={16} />
                            </Button>
                            <Button onClick={nextPage}>
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )
                }
            </div>
            {isLoading && <span>Carregando...</span>}
        </div>
    )
}