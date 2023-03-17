
class CustomFetch {
    defaultOptions: RequestInit

    constructor(baseOptions: RequestInit = {}) {
        this.defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
            ...baseOptions
        }
    }

    async fetch(url: string, options?: RequestInit): Promise<any> {
        const finalOptions: RequestInit & { timeout?: number} = {
            ...this.defaultOptions,
            ...options,
            timeout: 5000
        }
        try {
            const response = await fetch(url, finalOptions)
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}, message: ${response.statusText}`)
            } 
            const data = await response.json()
            return data
        } catch(error: unknown) {
            console.error(`Error fetching data: ${error}`)
            throw new Error(`Error fetching data: ${error}`)

        }
    }
}

export default new CustomFetch()
