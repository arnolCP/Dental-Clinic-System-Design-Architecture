export async function refreshToken() {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) return null;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("access", data.access);
            return data.access;
        } else {
            console.error("REFRESH FALLÓ:", data);
            return null;
        }
    } catch (error) {
        console.error("ERROR AL REFRESCAR TOKEN", error);
        return null;
    }
}
