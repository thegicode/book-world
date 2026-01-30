
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

    async fetch<T = unknown>(url: string, options?: RequestInit): Promise<T> {
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
            return data as T
        } catch(error: unknown) {
            console.error(`Error fetching data: ${error}`)
            throw new Error(`Error fetching data: ${error}`)

        }
    }

    async fetchData<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await this.fetch<IApiResponse<T>>(url, options);
        if (response.status === 'success') {
            return response.data;
        }
        throw new Error(response.message || `API request failed with status: ${response.status}`);
    }
}

export default new CustomFetch()
