import { component$ } from '@builder.io/qwik';

type Project = {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  link?: string;
};

export const ProjectCard = component$(({ project }: { project: Project }) => (
  <a
    href={`/projects/${project.id}/`}
    class="bg-white shadow rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer no-underline text-inherit"
  >
    <h2 class="text-xl font-semibold text-gray-900">{project.title}</h2>
    <p class="mt-2 text-gray-600 line-clamp-3">{project.description}</p>

    {project.image && (
      <img
        class="w-full mt-4 rounded"
        src={project.image}
        alt={project.title}
        loading="lazy"
      />
    )}

    {project.video && (
      <video class="w-full mt-2" controls>
        <source src={project.video} />
        Your browser does not support the video tag.
      </video>
    )}
  </a>
));
