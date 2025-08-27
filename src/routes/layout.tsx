import { component$, Slot } from '@builder.io/qwik';
import { Layout } from '~/components/Layout';

export default component$(() => (
  <Layout>
    <Slot />
  </Layout>
));