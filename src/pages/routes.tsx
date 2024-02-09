import { createBrowserRouter } from "react-router-dom";
import { SignInPage } from "./SignIn";
import { QuizzesPage } from "./Quizzes";
import { LayoutDashboard } from "@/components/layout";
import { AnswerQuiz } from "./Quizzes/anwser-quiz";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SignInPage />
    },
    {
        path: '/app',
        element: <LayoutDashboard />,
        children: [
            {
                path: '/app/quizzes',
                element: <QuizzesPage />
            },
            {
                path: '/app/quizzes/:quizId',
                element: <AnswerQuiz />
            }
        ]
    }
])