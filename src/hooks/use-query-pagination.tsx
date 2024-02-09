import { useState } from "react"
import { useQuery } from "react-query"
import api from "@/utils/api"
import { AxiosRequestConfig } from "axios"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface QueryPagination<T> {
    url: string
    queryKey: string
    httpParams?: AxiosRequestConfig['params']
    pagination?: {
        perPage: number
    }
}

interface ResponseWithResultMetadata {
    resultSetMetadata: {
        count: number
        offset: number
        limit: number
    }
    results: []
}

export function useQueryPagination<T>(props: QueryPagination<T>) {
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(props.pagination?.perPage ?? 10)
    const [count, setCount] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: [props.queryKey, offset, limit],
        queryFn: (async () => {
            const response = await api.get<ResponseWithResultMetadata>(props.url, {
                params: {
                    offset,
                    limit,
                    ...props.httpParams
                }
            })
    
            if(response.data) {
                setCount(response.data.resultSetMetadata.count)
                return response.data.results as T[]
            }
        }),
        refetchOnWindowFocus: false
    })

    function nextPage() {
        if(count > limit) {
            setOffset(stateOffset => stateOffset + limit)
        }
    }

    function previousPage() {
        if((offset - limit) < 0) {
            return setOffset(0)
        }

        setOffset(prevState => prevState - limit)
    }
    return {
        count,
        limit,
        data,
        isLoading,
        nextPage,
        previousPage,
        setLimit
    }
}