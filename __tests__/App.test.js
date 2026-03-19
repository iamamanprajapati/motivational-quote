/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

const storage = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((k, v) => {
    storage[k] = v;
    return Promise.resolve();
  }),
  getItem: jest.fn(k => Promise.resolve(storage[k] ?? null)),
  multiSet: jest.fn(pairs => {
    pairs.forEach(([k, v]) => {
      storage[k] = v;
    });
    return Promise.resolve();
  }),
  removeItem: jest.fn(k => {
    delete storage[k];
    return Promise.resolve();
  }),
}));

test('renders without throwing', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
