const { join } = require('path');

const test = require('ava');
const prettier = require('prettier');

const pkg = require('./fixtures/fixture.json');

const shuffle = (arr) => {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [result[i], result[rand]] = [result[rand], result[i]];
  }
  return result;
};

test('randomize', (t) => {
  const options = {
    filepath: join(__dirname, 'package.json'),
    parser: 'json-stringify',
    plugins: ['.'],
    shit: 'balls'
  };
  const keys = shuffle(Object.keys(pkg));
  const fixture = {};

  for (const key of keys) {
    fixture[key] = pkg[key];
  }

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('preprocess', (t) => {
  const options = {
    filepath: join('package.json'),
    parser: 'json-stringify',
    plugins: ['.'],
    preprocess: (input) => {
      const { version, repository } = JSON.parse(input);
      const result = { repository, version };
      return result;
    }
  };
  const keys = shuffle(Object.keys(pkg));
  const fixture = {};

  for (const key of keys) {
    fixture[key] = pkg[key];
  }

  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.snapshot(output);
});

test('not package.json', (t) => {
  const options = {
    filepath: 'batman.json',
    parser: 'json-stringify',
    plugins: ['.']
  };
  const fixture = { version: 'batman', name: 'joker' };
  const input = JSON.stringify(fixture, null, 2);
  const output = prettier.format(input, options);

  t.is(input.trim(), output.trim());
});
