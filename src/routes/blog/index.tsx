import { component$, useResource$, Resource } from '@builder.io/qwik';
import { BlogPostCard } from '~/components/BlogPostCard';

export default component$(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;

    const blogPostsResource = useResource$<any[]>(async () => {
        const res = await fetch(`${apiBase}/blogposts/`);
        const data = await res.json();
        return data.results || data;
    });

    return (
        <>
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
        </>
    );
});
