import { createBrowserRouter } from "react-router-dom";
import { SignInPage } from "./SignIn";
import { QuizzesPage } from "./Quizzes";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SignInPage />
    },
    {
        path: '/quizzes',
        element: <QuizzesPage />
    }
])