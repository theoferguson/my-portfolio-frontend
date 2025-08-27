// src/lib/api.ts
export interface Paginated<T> {
    results?: T[];
    next?: string | null;
    previous?: string | null;
}

export interface Project {
    id: number;
    title: string;
    description?: string;
    image?: string;
    video?: string;
    link?: string;
    [k: string]: any;
}

export interface BlogPost {
    id: number;
    title: string;
    content: string;          // HTML string from your backend
    cover_image?: string;
    published_date?: string;
    projects?: Project[];
    [k: string]: any;
}

export interface Profile {
    id: number;
    name?: string;
    [k: string]: any;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/** Fetch JSON with a return type. Falls back to throwing on !ok. */
export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`GET ${path} failed: ${res.status} ${res.statusText} ${text}`);
    }
    // Tell TS what type to expect
    return (await res.json()) as T;
}

/** Helper: some endpoints return {results: T[]} or T[] directly */
export function unwrapResults<T>(data: Paginated<T> | T[]): T[] {
    return Array.isArray((data as any).results) ? (data as Paginated<T>).results! : (data as T[]);
}
