import { component$ } from '@builder.io/qwik';

type BlogPost = {
    id: number;
    title: string;
    content: string;
    image?: string;
    video?: string;
    published_at?: string;
};

export const BlogPostCard = component$(({ post }: { post: BlogPost }) => (
    <a
        href={`/blog/${post.id}/`}
        class="bg-white shadow rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 no-underline text-inherit"
    >
        <h2 class="text-xl font-semibold text-gray-900">{post.title}</h2>
        <p class="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
        {post.image && <img class="w-full mt-4 rounded" src={post.image} alt={post.title} loading="lazy" />}
        {post.video && (
            <video class="w-full mt-2" controls>
                <source src={post.video} />
                Your browser does not support the video tag.
            </video>
        )}
        <span class="text-xs text-gray-400 mt-auto pt-3">{post.published_at?.slice(0, 10)}</span>
    </a>
));
