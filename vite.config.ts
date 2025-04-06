import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import react from '@vitejs/plugin-react-swc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeShiki,
          { themes: { light: 'github-light', dark: 'github-dark' } },
        ],
        rehypeSlug,
      ],
    }),
    react(),
  ],
  server: {
    open: true,
  },
})
