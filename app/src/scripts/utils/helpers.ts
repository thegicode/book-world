export function getCurrentDates() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentDay = String(currentDate.getDate()).padStart(2, "0");

    return {
        currentDate,
        currentYear,
        currentMonth,
        currentDay,
    };
}

export function cloneTemplate<T extends HTMLElement>(
    template: HTMLTemplateElement
) {
    const content = template.content.firstElementChild;
    if (!content) {
        throw new Error("Template content is empty");
    }
    return content.cloneNode(true) as T;
}

export function fillElementsWithData<T>(data: T, container: HTMLElement) {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
        const element = container.querySelector(`.${key}`) as HTMLElement;
        if (!element) {
            console.error(`${key} element is not exist. Please check ${key}.`);
            return;
        }
        element.textContent = String(value);
    });
}

async function fetchHTMLTemplate(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch template: ${response.status} ${response.statusText}`
            );
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching HTML template:", error);
        return null;
    }
}

async function parseHTMLTemplate(html: string) {
    try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.querySelector("template");
    } catch (error) {
        console.error("Error parsing HTML template:", error);
        return null;
    }
}

export async function fetchAndParseTemplate(templateURL: string) {
    try {
        const html = await fetchHTMLTemplate(templateURL);
        if (!html) return null;

        return parseHTMLTemplate(html);
    } catch (error) {
        console.error("Error fetching and parsing template", error);
        return null;
    }
}
