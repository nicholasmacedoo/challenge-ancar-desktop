import { RouterProvider } from "react-router-dom"
import { router } from "./pages/routes"
import { AppProvider } from "./contexts"

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
