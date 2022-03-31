import { ComponentType, lazy, Suspense } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from 'react-router-dom'

import Home from '../README.md'

import './global.css'
import 'github-markdown-css'

const Package = () => {
  const { name } = useParams<{ name: string }>()
  const Pkg = lazy(
    () =>
      import(`../packages/${name!}/README.md`) as Promise<{
        default: ComponentType
      }>,
  )
  return (
    <Suspense fallback={null}>
      <Pkg />
    </Suspense>
  )
}

export const App = () => (
  <Router>
    <Routes>
      <Route path="/packages/:name" element={<Package />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
)
