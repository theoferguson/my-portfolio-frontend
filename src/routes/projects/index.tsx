import { component$, useResource$, Resource } from '@builder.io/qwik';
import { ProjectCard } from '~/components/ProjectCard';

export default component$(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;

    // Qwik's SSR-friendly fetch (runs on server, then client)
    const projectsResource = useResource$<any[]>(async () => {
        const res = await fetch(`${apiBase}/projects/`);
        const data = await res.json();
        // If paginated, return data.results; else just data
        return data.results || data;
    });

    return (
        <div class="container mx-auto p-8">
            <h1 class="text-3xl font-bold mb-6">Projects</h1>
            <Resource
                value={projectsResource}
                onPending={() => <div>Loading...</div>}
                onRejected={(error) => <div>Error loading projects: {error.message}</div>}
                onResolved={(projects) => (
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            />
        </div>
    );
});
