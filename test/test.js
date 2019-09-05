const { join } = require('path');

const test = require('ava');
const prettier = require('prettier');

const pkg = require('../package.json');

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
    plugins: ['.']
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
