import { component$, useResource$, Resource } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { BlogPostCard } from '~/components/BlogPostCard';

export default component$(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

    const blogPostsResource = useResource$<any[]>(async () => {
        const res = await fetch(`${apiBase}/blogposts/`);
        const data = (await res.json()) as any;
        return data.results ?? data;
    });

    return (
        <div class="container mx-auto p-8">
            <h1 class="text-3xl font-bold mb-6">Blog</h1>
            <Resource
                value={blogPostsResource}
                onPending={() => <div>Loading...</div>}
                onRejected={() => <div>Error loading blog posts.</div>}
                onResolved={(posts) => (
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            />
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Blog | Theo Ferguson',
    meta: [{ name: 'description', content: 'Writing on software, projects, and engineering.' }],
};
