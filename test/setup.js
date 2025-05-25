// Jest setup file

// Mock DOM APIs that aren't available in Jest
global.fetch = jest.fn();
global.navigator = {
  clipboard: {
    writeText: jest.fn()
  }
};
global.alert = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;