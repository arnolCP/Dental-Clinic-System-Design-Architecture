import { refreshToken } from "./refreshToken";

export async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem("access");

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    // Si el token expiró (401)
    if (response.status === 401) {
        console.log("Token expirado, renovando...");

        const newToken = await refreshToken();

        if (!newToken) {
            window.location.href = "/login";
            return;
        }

        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    return response;
}
