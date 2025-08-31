import { component$, useResource$, Resource, useSignal, $ } from '@builder.io/qwik';

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default component$(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    const submitting = useSignal(false);
    const error = useSignal('');
    const success = useSignal('');

    const profileResource = useResource$<any>(async () => {
        const res = await fetch(`${apiBase}/profile/`);
        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
        const data = (await res.json()) as any;
        if (!data.results || !data.results.length) throw new Error('No profile data returned');
        return data.results[0];
    });


    const handleSubmit = $(async (event: any) => {
        event.preventDefault();
        submitting.value = true;
        error.value = '';
        success.value = '';
        try {
            // 1. Get the reCAPTCHA token
            const token = await window.grecaptcha.execute('6LdftWkrAAAAAC2B06jIPpjAb8DBXJVIWbQdCQvV', { action: 'submit' });

            // 2. Collect form data
            const formData = {
                name: event.target.name.value,
                email: event.target.email.value,
                message: event.target.message.value,
                honeypot: event.target.honeypot.value,
                recaptcha_token: token,
            };
            console.log('Form submitted with data:', formData);

            // 3. Send to backend
            const res = await fetch(`${apiBase}/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            console.log('API response:', result);
            if (res.ok) {
                success.value = 'Message sent!';
            } else {
                error.value = 'Failed to send message. Please try again.';
            }
        } catch (e) {
            error.value = 'reCAPTCHA failed or was blocked.';
            console.log(e)
        }
        submitting.value = false;
    });

    return (
        <div class="max-w-lg mx-auto py-12">
            <Resource
                value={profileResource}
                onPending={() => <div>Loading contact info…</div>}
                onRejected={err => {
                    console.error('Contact page rendering error:', err);
                    return (
                        <div class="bg-yellow-100 text-yellow-800 p-4 rounded">
                            Could not load contact info at this time.<br />
                            Please try refreshing, or check back later.
                        </div>
                    );
                }}
                onResolved={profile => (
                    <>
                        <h1 class="text-2xl font-bold mb-4">Contact Me</h1>
                        {success.value ? (
                            <div class="bg-green-100 text-green-800 p-4 rounded shadow">
                                <p class="text-lg font-semibold">Thanks for reaching out!</p>
                                <p class="mt-1">I'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <>
                                <form
                                    class="flex flex-col gap-4"
                                    preventdefault:submit
                                    onSubmit$={handleSubmit}
                                >
                                    <input
                                        type="text"
                                        name="honeypot"
                                        class="hidden"
                                        tabIndex={-1}
                                        autocomplete="off"
                                    />
                                    <input
                                        name="name"
                                        class="border p-2 rounded"
                                        type="text"
                                        placeholder="Your name"
                                        required
                                    />
                                    <input
                                        name="email"
                                        class="border p-2 rounded"
                                        type="email"
                                        placeholder="Your email"
                                        required
                                    />
                                    <textarea
                                        name="message"
                                        class="border p-2 rounded"
                                        placeholder="Your message"
                                        rows={4}
                                        required
                                    />
                                    <button class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" type="submit" disabled={submitting.value}>
                                        Send
                                    </button>
                                </form>
                                <p class="mt-4 text-sm text-gray-500">
                                    Or email me at{' '}
                                    {profile.email ? (
                                        <a href={`mailto:${profile.email}`} class="underline">
                                            {profile.email}
                                        </a>
                                    ) : (
                                        <span class="italic text-gray-500">(not provided)</span>
                                    )}
                                </p>
                            </>
                        )}

                        <div class="mt-4">
                            {profile.linkedin && (
                                <a
                                    href={profile.linkedin}
                                    class="text-blue-700 underline mr-4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {profile.github && (
                                <a
                                    href={profile.github}
                                    class="text-gray-700 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                            )}
                        </div>
                    </>
                )}
            />
        </div>
    );
});