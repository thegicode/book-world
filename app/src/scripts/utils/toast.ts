// app/src/scripts/utils/toast.ts

const TOAST_CONTAINER_ID = 'toast-container';

function createToastContainer() {
    const container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    document.body.appendChild(container);
    return container;
}

function getToastContainer() {
    return document.getElementById(TOAST_CONTAINER_ID) || createToastContainer();
}

export function showToast(message: string, duration: number = 3000) {
    const container = getToastContainer();
    const toastElement = document.createElement('div');
    toastElement.className = 'toast-message';
    toastElement.textContent = message;

    container.appendChild(toastElement);

    setTimeout(() => {
        toastElement.remove();
    }, duration);
}
