// api.js — Option A (Frontend-only on Firebase + Backend hosted elsewhere)

// Automatically switch between local and production API URLs
const API_ORIGIN = location.hostname.includes("localhost")
    ? "http://localhost:3000"                  // when running locally with node server.js
    : "https://your-backend-domain.com";       // your deployed Node/Express backend URL (Render, Railway, etc.)

// Helper to validate JSON responses
async function parseJsonOrThrow(res) {
    if (!res) throw new Error("No response (network error?)");
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} at ${res.url}\n${text.slice(0, 200)}`);
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${ct}\nSnippet: ${text.slice(0, 200)}`);
    }

    return res.json();
}

// Main API wrapper
const API = {
    // Get last workout
    async getLastWorkout() {
        const res = await fetch(`${API_ORIGIN}/api/workouts`, {
            headers: { Accept: "application/json" },
        });
        const json = await parseJsonOrThrow(res);
        return Array.isArray(json) ? json.at(-1) ?? null : json;
    },

    // Add a new exercise to a workout
    async addExercise(data) {
        const id = new URLSearchParams(location.search).get("id");
        const res = await fetch(`${API_ORIGIN}/api/workouts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return parseJsonOrThrow(res);
    },

    // Create a new workout
    async createWorkout(data = {}) {
        const res = await fetch(`${API_ORIGIN}/api/workouts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return parseJsonOrThrow(res);
    },

    // Get workout stats (range)
    async getWorkoutsInRange() {
        const res = await fetch(`${API_ORIGIN}/api/workouts/range`, {
            headers: { Accept: "application/json" },
        });
        return parseJsonOrThrow(res);
    },
};

// Expose globally
window.API = API;
