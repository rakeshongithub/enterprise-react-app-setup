import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createHandler, createHandlers } from './handlerFactory'
import { mockConfig } from './mock.config'
import type { MockEndpointConfig } from './mock.config'

const server = setupServer()
const apiUrl = (path: string) => `http://localhost:3000/api${path}`

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('createHandler', () => {
  it('returns null for disabled endpoints', () => {
    const config: MockEndpointConfig = {
      method: 'GET',
      path: '/disabled',
      enabled: false,
      response: { enabled: false },
    }

    expect(createHandler(config)).toBeNull()
  })

  it('serves static responses with configured status and headers', async () => {
    server.use(
      createHandler({
        method: 'GET',
        path: '/health',
        enabled: true,
        response: { healthy: true },
        status: 202,
        delay: 0,
        headers: { 'X-Test': 'mock' },
      })!,
    )

    const response = await fetch(apiUrl('/health'))

    expect(response.status).toBe(202)
    expect(response.headers.get('X-Test')).toBe('mock')
    await expect(response.json()).resolves.toEqual({ healthy: true })
  })

  it('passes route params and request bodies to dynamic responses', async () => {
    server.use(
      createHandler({
        method: 'POST',
        path: '/users/:id',
        enabled: true,
        response: (params) => ({
          id: params?.id,
          body: params?.body,
        }),
        delay: 0,
      })!,
    )

    const response = await fetch(apiUrl('/users/42'), {
      method: 'POST',
      body: JSON.stringify({ name: 'Ada' }),
      headers: { 'Content-Type': 'application/json' },
    })

    await expect(response.json()).resolves.toEqual({
      id: '42',
      body: { name: 'Ada' },
    })
  })

  it.each(['PUT', 'PATCH', 'DELETE'] as const)('supports the %s method', async (method) => {
    server.use(
      createHandler({
        method,
        path: `/method/${method.toLowerCase()}`,
        enabled: true,
        response: { method },
        delay: 0,
      })!,
    )

    const response = await fetch(apiUrl(`/method/${method.toLowerCase()}`), { method })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ method })
  })

  it('handles invalid request bodies for dynamic responses', async () => {
    server.use(
      createHandler({
        method: 'POST',
        path: '/invalid-body',
        enabled: true,
        response: (params) => ({ body: params?.body }),
        delay: 0,
      })!,
    )

    const response = await fetch(apiUrl('/invalid-body'), {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    })

    await expect(response.json()).resolves.toEqual({ body: null })
  })

  it('applies delay, request logging, and a dynamic status override', async () => {
    mockConfig.logRequests = true
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    server.use(
      createHandler({
        method: 'GET',
        path: '/created',
        enabled: true,
        response: () => ({ status: 201, created: true }),
        delay: 1,
      })!,
    )

    const response = await fetch(apiUrl('/created'))

    expect(response.status).toBe(201)
    expect(logSpy).toHaveBeenCalledOnce()
    logSpy.mockRestore()
  })

  it('returns a server error when a dynamic response throws', async () => {
    server.use(
      createHandler({
        method: 'GET',
        path: '/failure',
        enabled: true,
        response: () => {
          throw new Error('mock failure')
        },
        delay: 0,
      })!,
    )

    const response = await fetch(apiUrl('/failure'))

    expect(response.status).toBe(500)
  })
})

describe('createHandlers', () => {
  it('filters disabled endpoint handlers', () => {
    const handlers = createHandlers([
      {
        method: 'GET',
        path: '/enabled',
        enabled: true,
        response: {},
        delay: 0,
      },
      {
        method: 'GET',
        path: '/disabled',
        enabled: false,
        response: {},
      },
    ])

    expect(handlers).toHaveLength(1)
  })
})
