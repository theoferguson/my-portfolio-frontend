import { component$, useResource$, Resource } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
    const loc = useLocation();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    const postId = loc.params.id;

    const postResource = useResource$<any>(async () => {
        const res = await fetch(`${apiBase}/blogposts/${postId}/`);
        if (!res.ok) throw new Error(`Blog post not found (${res.status})`);
        const data = (await res.json()) as any;
        return data;
    });

    return (
        <div class="max-w-2xl mx-auto prose py-12">
            <Resource
                value={postResource}
                onPending={() => <div>Loading blog post…</div>}
                onRejected={() => (
                    <div class="bg-yellow-100 text-yellow-800 p-4 rounded">
                        Could not load blog post. It may not exist.
                    </div>
                )}
                onResolved={post => (
                    <>
                        <h1>{post.title}</h1>
                        <p class="text-sm text-gray-500">{post.published_date}</p>
                        {post.cover_image && (
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                class="rounded my-4"
                                onError$={e => {
                                    if (e.target) {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }
                                }}
                            />
                        )}
                        <div dangerouslySetInnerHTML={post.content} />
                        {post.projects && post.projects.length > 0 && (
                            <div class="mt-2 flex flex-wrap gap-2">
                                {post.projects.map((project: any) => (
                                    <a
                                        key={project.id}
                                        href={`/projects/${project.id}/`}
                                        class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200"
                                    >
                                        {project.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            />
        </div>
    );
});