import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
// export default defineConfig({
//     plugins: [react(), tailwindcss()]
// })

type TMode = 'development' | 'production'

interface envVariables {
    PORT: string
    VITE_ENV: string
    BACKEND_PROXY: string
}

function envValidation(allEnvVariables: envVariables, envMode: TMode) {
    const env: (keyof envVariables)[] = ['PORT', 'VITE_ENV']
    env.forEach((element) => {
        if (!Object.keys(allEnvVariables).includes(element)) {
            throw new Error(`${element} is missing from ${envMode}`)
        }
    })
}

function normalisePort(port: string): number {
    const value = parseInt(port)
    if (isNaN(value)) throw new Error('invalid PORT Number')
    return value
}

export default defineConfig(({ mode }) => {
    // here we destructure mode form obj

    const envMode = mode as TMode
    // console.log('mode--',mode)
    const allEnvVariables = loadEnv(envMode, process.cwd(), '') as unknown as envVariables // loadEnv is fn that provides vite that load all env's from current-working-directory(cwd)

    envValidation(allEnvVariables, envMode)

    // now create fn to convert port string into number
    const port = normalisePort(allEnvVariables.PORT)

    // const config = {
    //     port,
    //     open: true
    //     // Proxy:{
    //     //     '/api':{
    //     //         target:'https://dummyjson.com/test',
    //     //         changeOrigin:true,
    //     //         rewrite: (path:string) => {
    //     //              console.log('Rewriting path:', path);
    //     //            return path.replace(/^\/api/, '')
    //     //         }
    //     //     }
    //     // }
    // }  // we cant assign config obj to server or preview it coz parsing error

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: port,
            open: true,
            proxy: {
                // now we make  https://dummyjson.com/test this to proxy
                '/api': {
                    target: allEnvVariables.BACKEND_PROXY, //'https://dummyjson.com/test'
                    changeOrigin: true,
                    rewrite: (path: string) => {
                        //  console.log('Rewriting path:', path);
                        return path.replace(/^\/api/, '')
                    }
                }
            }
        }, // now when we run our react app it runs on this port not a default 5173 port
        preview: {
            port: port,
            open: true,
            proxy: {
                '/api': {
                    target: allEnvVariables.BACKEND_PROXY, // 'https://dummyjson.com/test'
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, '')
                }
            }
        },
        build: {
            minify: true // make build code in minify version
        }
    }
})
