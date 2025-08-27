import { component$, useResource$, Resource } from '@builder.io/qwik';

export default component$(() => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const profileResource = useResource$(async () => {
    try {
      const res = await fetch(`${apiBase}/profile/`);
      if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Profile API response:', data);
      if (!data.results || !data.results.length) throw new Error('No profile data returned');
      return data.results[0];
    } catch (err) {
      console.error('About page API error:', err);
      throw err;
    }
  });

  return (
    <div class="prose mx-auto py-12">
      <Resource
        value={profileResource}
        onPending={() => <div>Loading profile…</div>}
        onRejected={err => {
          console.error('About page rendering error:', err);
          return (
            <div class="bg-yellow-100 text-yellow-800 p-4 rounded">
              Could not load profile info at this time.<br />
              Please try refreshing, or check back later.
            </div>
          );
        }}
        onResolved={profile => (
          <>
            <h1>About Me</h1>
            {profile.headshot ? (
              <img
                src={profile.headshot}
                alt={profile.name || 'Profile headshot'}
                class="rounded-full w-40 mx-auto mb-4 shadow-md"
                onError$={e => {
                  console.error('Image failed to load:', e);
                  if (e.target) {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }
                }}
              />
            ) : (
              <div class="mb-4 italic text-gray-500 text-center">
                (No headshot available)
              </div>
            )}
            <p>{profile.bio || <span class="italic text-gray-500">(No bio provided)</span>}</p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                {profile.email ? (
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                ) : (
                  <span class="italic text-gray-500">(not provided)</span>
                )}
              </li>
              {profile.linkedin && (
                <li>
                  <strong>LinkedIn:</strong>{' '}
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    {profile.linkedin}
                  </a>
                </li>
              )}
              {profile.github && (
                <li>
                  <strong>GitHub:</strong>{' '}
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    {profile.github}
                  </a>
                </li>
              )}
            </ul>
          </>
        )}
      />
    </div>
  );
});