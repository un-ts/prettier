const test = require('ava');
const prettier = require('prettier');

test('default', (t) => {
  const options = {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    engines: {
      npm: 'joker',
      node: 'batman'
    }
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('enginesNode', (t) => {
  const options = {
    enginesNode: '>= batcave',
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    engines: {
      npm: 'joker',
      node: 'batman'
    }
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('enginesNpm', (t) => {
  const options = {
    enginesNpm: '>= harley',
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    engines: {
      npm: 'joker',
      node: 'batman'
    }
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('missing', (t) => {
  const options = {
    enginesNode: '>= batcave',
    enginesNpm: '>= harley',
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = {
    engines: {}
  };

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});
