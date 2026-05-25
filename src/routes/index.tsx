import { component$, useResource$, Resource } from '@builder.io/qwik';
import { ProjectCard } from '~/components/ProjectCard';

export default component$(() => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  const projectsResource = useResource$<any[]>(async () => {
    const res = await fetch(`${apiBase}/projects/?ordering=-created_at&limit=3`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = (await res.json()) as any;
    return data.results ?? data;
  });

  return (
    <div class="max-w-6xl mx-auto mt-8">
      <h1 class="text-3xl font-bold mb-6">Featured Projects</h1>
      <Resource
        value={projectsResource}
        onPending={() => <div>Loading projects…</div>}
        onRejected={() => (
          <div class="bg-yellow-100 text-yellow-800 p-2 rounded">
            Could not load projects.
          </div>
        )}
        onResolved={projects => (
          <>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div class="mt-10 flex justify-center">
              <a
                href="/projects/"
                class="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
              >
                View All Projects →
              </a>
            </div>
          </>
        )}
      />
    </div>
  );
});
