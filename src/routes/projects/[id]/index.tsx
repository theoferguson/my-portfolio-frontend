import { component$, useResource$, Resource } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const loc = useLocation();
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const projectId = loc.params.id;

  const projectResource = useResource$<any>(async () => {
    const res = await fetch(`${apiBase}/projects/${projectId}/`);
    if (!res.ok) throw new Error(`Project not found (${res.status})`);
    const data = (await res.json()) as any;
    return data;
  });

  return (
    <div class="max-w-2xl mx-auto prose py-12">
      <Resource
        value={projectResource}
        onPending={() => <div>Loading project…</div>}
        onRejected={() => (
          <div class="bg-yellow-100 text-yellow-800 p-4 rounded">
            Could not load project. It may not exist.
          </div>
        )}
        onResolved={project => (
          <>
            <h1>{project.title}</h1>
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                class="rounded my-4"
                onError$={e => {
                  if (e.target && 'style' in e.target) {
                    (e.target as HTMLElement).style.display = 'none';
                  }
                }}
              />
            )}
            {project.video && (
              <video class="w-full my-4" controls>
                <source src={project.video} />
                Your browser does not support the video tag.
              </video>
            )}
            <p>{project.description}</p>
            {project.link && (
              <a href={project.link} class="text-blue-700 underline" target="_blank">
                Visit project
              </a>
            )}
          </>
        )}
      />
    </div>
  );
});