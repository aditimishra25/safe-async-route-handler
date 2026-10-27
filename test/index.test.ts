
import { describe, expect, it, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

import { safeAsyncHandler } from '../src/index.js';

describe('safeAsyncHandler', () => {
  const req = {} as Request;
  const res = {} as Response;

  it('forwards rejected async errors to next()', async () => {
    const error = new Error('Something went wrong');
    const next = vi.fn();
    const handler = safeAsyncHandler(async () => {
      throw error;
    });

    handler(req, res, next as unknown as NextFunction);

    // Allow the rejected promise and catch callback to execute.
    await Promise.resolve();
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });

  it('does not call next() when the handler succeeds', async () => {
    const next = vi.fn();
    const handler = safeAsyncHandler(async () => 'success');

    handler(req, res, next as unknown as NextFunction);

    await Promise.resolve();
    await Promise.resolve();

    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a synchronous exception to next()', () => {
    const error = new Error('Synchronous failure');
    const next = vi.fn();
    const handler = safeAsyncHandler(() => {
      throw error;
    });

    handler(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });


  it('forwards a rejected promise exactly once', async () => {
    const error = new Error('Async failure');
    const next = vi.fn();
    const handler = safeAsyncHandler(() => Promise.reject(error));

    handler(req, res, next as unknown as NextFunction);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('supports handlers that return a non-promise value', () => {
    const next = vi.fn();
    const handler = safeAsyncHandler(() => undefined);

    expect(() => {
      handler(req, res, next as unknown as NextFunction);
    }).not.toThrow();

    expect(next).not.toHaveBeenCalled();
  });

});
