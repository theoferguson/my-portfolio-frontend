import { component$, useResource$, Resource } from '@builder.io/qwik';
import { ProjectCard } from '~/components/ProjectCard';

// Optionally, import a reusable ProjectCard if you have one
// import { ProjectCard } from '../components/ProjectCard';

export default component$(() => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  // Fetch latest 5 blog posts
  const blogsResource = useResource$(async () => {
    try {
      const res = await fetch(`${apiBase}/blogposts/?ordering=-published_date&limit=5`);
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
      return data.results ? data.results : data;
    } catch (err) {
      console.error('Blog sidebar API error:', err);
      throw err;
    }
  });

  // Fetch top 3 projects (customize ordering if needed)
  const projectsResource = useResource$(async () => {
    try {
      const res = await fetch(`${apiBase}/projects/?ordering=-created_at&limit=3`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      return data.results ? data.results : data;
    } catch (err) {
      console.error('Projects API error:', err);
      throw err;
    }
  });

  return (
    <div class="flex flex-col md:flex-row gap-8 mt-8 max-w-6xl mx-auto">
      {/* Main section: Top Projects */}
      <div class="flex-1">
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
              <div class="mt-6 text-right">
                <a href="/projects/" class="text-blue-600 hover:underline font-semibold">
                  Show more →
                </a>
              </div>
            </>
          )}
        />
      </div>

      {/* Blog sidebar */}
      <aside class="w-full md:w-80 bg-gray-50 border rounded p-4 shadow-sm">
        <h2 class="text-xl font-semibold mb-3">Latest Blog Posts</h2>
        <Resource
          value={blogsResource}
          onPending={() => <div>Loading…</div>}
          onRejected={() => (
            <div class="text-yellow-700 bg-yellow-100 p-2 rounded text-sm">
              Could not load blog posts.
            </div>
          )}
          onResolved={blogs => (
            <>
              <ul>
                {blogs.slice(0, 5).map((post: any) => (
                  <li key={post.id} class="mb-2">
                    <a
                      href={`/blog/${post.id}/`}
                      class="text-blue-700 hover:underline"
                    >
                      {post.title}
                    </a>
                    <div class="text-xs text-gray-500">{post.published_date?.slice(0, 10)}</div>
                  </li>
                ))}
              </ul>
              <div class="mt-4 text-right">
                <a
                  href="/blog/"
                  class="text-sm text-blue-600 hover:underline font-semibold"
                >
                  Show more →
                </a>
              </div>
            </>
          )}
        />
      </aside>
    </div>
  );
});