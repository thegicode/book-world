export async function fetchData(url: string, headers?: Record<string, string>) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
}

export async function fetchWeb(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching web page:", error);
        throw error;
    }
}
