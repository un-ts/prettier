const test = require('ava');
const prettier = require('prettier');

test('default', (t) => {
  const options = {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    files: ['lib/']
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('filesLicense', (t) => {
  const options = {
    filepath: 'package.json',
    filesLicense: false,
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    files: ['lib/']
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('filesReadme', (t) => {
  const options = {
    filepath: 'package.json',
    filesReadme: false,
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    files: ['lib/']
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});
