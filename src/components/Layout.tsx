import { component$, Slot, useSignal } from '@builder.io/qwik';

export const Layout = component$(() => {
    const open = useSignal(false);

    return (
        <div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Header/Nav goes here */}
            <header class="bg-white shadow py-4 px-9 flex items-center justify-between">
                {/* Logo/brand */}
                <a href="/" class="text-2xl font-bold text-blue-600">
                    Theo Ferguson
                </a>

                {/* Desktop nav */}
                <nav class="hidden md:flex space-x-8">
                    <a href="/projects/" class="hover:underline">Projects</a>
                    <a href="/blog/" class="hover:underline">Blog</a>
                    <a href="/about/" class="hover:underline">About</a>
                    <a href="/contact/" class="hover:underline">Contact</a>
                </nav>

                {/* Burger for mobile */}
                <button
                    class="md:hidden p-2"
                    aria-label="Open menu"
                    onClick$={() => (open.value = !open.value)}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile nav overlay */}
                {open.value && (
                    <div
                        class="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
                        onClick$={() => (open.value = false)}
                    >
                        <nav
                            class="w-2/3 max-w-xs bg-white h-full shadow-lg p-8 flex flex-col space-y-6 text-lg"
                            onClick$={e => e.stopPropagation()}
                        >
                            <button
                                class="self-end text-2xl p-1"
                                aria-label="Close menu"
                                onClick$={() => (open.value = false)}
                            >
                                &times;
                            </button>
                            <a href="/projects/" class="hover:underline" onClick$={() => (open.value = false)}>Projects</a>
                            <a href="/blog/" class="hover:underline" onClick$={() => (open.value = false)}>Blog</a>
                            <a href="/about/" class="hover:underline" onClick$={() => (open.value = false)}>About</a>
                            <a href="/contact/" class="hover:underline" onClick$={() => (open.value = false)}>Contact</a>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main class="flex-1 container mx-auto p-8">
                <Slot />
            </main>
            <button
                class="fixed bottom-4 right-24 bg-blue-600 text-white p-2 rounded shadow"
                onClick$={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                ↑ Top
            </button>

            {/* Footer */}
            <footer class="bg-gray-200 py-4 px-8 text-center text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Theo Ferguson
            </footer>
        </div>
    )
});