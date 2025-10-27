// In api.js
async function parseJsonOrThrow(res) {
    if (!res) throw new Error('No response (network error?)');
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} at ${res.url}\n${text.slice(0,200)}`);
    }
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${ct}\nSnippet: ${text.slice(0,200)}`);
    }
    return res.json();
}

const API = {
    async getLastWorkout() {
        const res = await fetch("/api/workouts");
        const json = await parseJsonOrThrow(res);
        return json[json.length - 1];
    },
    async addExercise(data) {
        const id = new URLSearchParams(location.search).get('id');
        const res = await fetch(`/api/workouts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return parseJsonOrThrow(res);
    },
    async createWorkout(data = {}) {
        const res = await fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return parseJsonOrThrow(res);
    },
    async getWorkoutsInRange() {
        const res = await fetch("/api/workouts/range");
        return parseJsonOrThrow(res);
    },
};
