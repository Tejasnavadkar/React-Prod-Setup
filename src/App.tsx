import { LoginPage } from '@features/auth'
import './App.css'

function App() {
    // console.log(import.meta.env.VITE_ENV) // it gives eslint error
    return (
        <>
            <div>Hello</div>
            <LoginPage />
        </>
    )
}

export default App
