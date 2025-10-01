// jest-setup.ts
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Polyfills for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator.share
Object.defineProperty(navigator, 'share', {
  writable: true,
  // FIX: Use mockResolvedValue(undefined) for Promises that resolve to void to fix type inference issues.
  value: jest.fn().mockResolvedValue(undefined),
});

// Mock navigator.clipboard - avoid redefinition issues
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    value: {
      // FIX: Use mockResolvedValue(undefined) for Promises that resolve to void to fix type inference issues.
      writeText: jest.fn().mockResolvedValue(undefined),
    },
  });
}