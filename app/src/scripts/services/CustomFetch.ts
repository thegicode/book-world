



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

                // This will be caught by the catch block below

                throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.statusText}`);

            } 

            const data = await response.json()

            return data as T

        } catch(error: unknown) {

            console.error(`Error fetching data: ${error}`);

            // Re-throw the error so that the calling code can still handle it if needed

            throw error;

        }

    }



    async fetchData<T>(url: string, options?: RequestInit): Promise<T> {

        const response = await this.fetch<IApiResponse<T>>(url, options);

        if (response.status === 'success') {

            return response.data;

        }

        

        const apiErrorMessage = response.message || `API 요청 실패: 상태 ${response.status}`;

        throw new Error(apiErrorMessage);

    }

}



export default new CustomFetch()
