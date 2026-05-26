import { component$, useResource$, Resource } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ProjectCard } from '~/components/ProjectCard';

export default component$(() => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

  const projectsResource = useResource$<{ featured: any[]; rest: any[] }>(async () => {
    const res = await fetch(`${apiBase}/projects/`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = (await res.json()) as any;
    const all: any[] = data.results ?? data;
    return {
      featured: all.filter((p: any) => p.featured),
      rest: all.filter((p: any) => !p.featured),
    };
  });

  return (
    <div class="max-w-6xl mx-auto mt-8">
      <Resource
        value={projectsResource}
        onPending={() => <div>Loading projects…</div>}
        onRejected={() => (
          <div class="bg-yellow-100 text-yellow-800 p-2 rounded">
            Could not load projects.
          </div>
        )}
        onResolved={({ featured, rest }) => (
          <>
            <h1 class="text-3xl font-bold mb-6">
              {featured.length > 0 ? 'Featured Projects' : 'Projects'}
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(featured.length > 0 ? featured : rest).map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {featured.length > 0 && rest.length > 0 && (
              <>
                <hr class="my-10 border-gray-200" />
                <h2 class="text-2xl font-semibold mb-6">More Projects</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rest.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Theo Ferguson | Software Engineer',
  meta: [{ name: 'description', content: 'Portfolio of Theo Ferguson — software engineer.' }],
};
