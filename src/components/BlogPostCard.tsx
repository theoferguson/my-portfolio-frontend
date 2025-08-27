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
    <div class="bg-white shadow rounded-lg p-4 flex flex-col">
        <h2 class="text-xl font-semibold">{post.title}</h2>
        <p class="mt-2">{post.content.substring(0, 150)}...</p>
        {post.image && <img class="w-full mt-4 rounded" src={post.image} alt={post.title} />}
        {post.video && (
            <video class="w-full mt-2" controls>
                <source src={post.video} />
                Your browser does not support the video tag.
            </video>
        )}
        <span class="text-xs text-gray-500 mt-2">{post.published_at?.slice(0, 10)}</span>
    </div>
));
