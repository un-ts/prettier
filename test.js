import { formatDockerfile } from '@reteps/dockerfmt'

console.log(
  await formatDockerfile('packages/sh/test/fixtures/Dockerfile', {
    indent: 2,
    trailingNewline: true,
  }),
)
