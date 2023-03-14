
class CustomFetch {
    constructor(baseOptions = {}) {
        this.defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
            timeout: 5000,
            ...baseOptions
        }
    }

    async fetch(url, options) {
        const finalOptions = {
            ...this.defaultOptions,
            ...options
        }
        try {
            const response = await fetch(url, finalOptions)
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`)
            } 
            const data = await response.json()
            return data
        } catch(error) {
            console.error(`Error fetching data: ${error}`);
            throw new Error(error);
        }
    }
}

export default CustomFetch

// async function customFetch(url, options) {
//     const baseOptions =  {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             // 'Authorization': `Bearer ${getToken()}`
//         },
//         timeout: 5000 
//     }
//     const finalOptions = { ...baseOptions, ...options}
//     try {
//         const response = await fetch(url, finalOptions)
//         if (!response.ok) {
//             throw new Error(`Http error! status: ${response.status}`)
//         } 
//         const data = await response.json()
//         return data
//     } catch(error) {
//         throw new Error(`Error fetching data : ${error}`)
//     }
// }

// export default customFetch