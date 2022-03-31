import { createRoot } from 'react-dom/client'

import { App } from './App'

const app = document.querySelector('#app')!

app.classList.add('markdown-body')

const root = createRoot(app)

root.render(<App />)
