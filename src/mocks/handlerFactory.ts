/**
 * MSW Handler Factory
 *
 * Generates MSW handlers from configuration objects.
 * This factory pattern makes handler creation declarative and type-safe.
 */

import { http, HttpResponse, delay as mswDelay } from 'msw'
import type { MockEndpointConfig } from './mock.config'
import { mockConfig } from './mock.config'

/**
 * Builds full API URL from path
 */
const apiUrl = (path: string): string => {
  const baseUrl = mockConfig.baseUrl.replace(/\/$/, '') // Remove trailing slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Creates an MSW handler from a mock endpoint configuration
 */
export function createHandler(config: MockEndpointConfig) {
  const { method, path, enabled, response, status = 200, delay, headers } = config

  // Skip disabled endpoints - they will use real API
  if (!enabled) {
    return null
  }

  const url = apiUrl(path)
  const responseDelay = delay ?? mockConfig.defaultDelay

  // Select appropriate HTTP method handler
  const httpMethod = (() => {
    switch (method) {
      case 'GET':
        return http.get
      case 'POST':
        return http.post
      case 'PUT':
        return http.put
      case 'DELETE':
        return http.delete
      case 'PATCH':
        return http.patch
      default:
        throw new Error(`Unsupported HTTP method: ${method}`)
    }
  })()

  // Create the handler
  return httpMethod(url, async ({ request, params, cookies }) => {
    // Apply response delay to simulate network latency
    if (responseDelay > 0) {
      await mswDelay(responseDelay)
    }

    // Log request for debugging (if enabled)
    if (mockConfig.logRequests) {
      console.log(`[MSW] ${method} ${path}`, {
        params,
        url: request.url,
      })
    }

    try {
      // Determine response data
      let responseData: unknown
      let responseStatus = status

      if (typeof response === 'function') {
        // Parse request body for POST/PUT/PATCH
        let body: unknown
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          try {
            body = await request.json()
          } catch {
            body = null
          }
        }

        // Call response function with context
        responseData = response({
          ...params,
          body,
          cookies,
          headers: Object.fromEntries(request.headers.entries()),
        })

        // Handle error responses from function
        if (responseData && typeof responseData === 'object' && 'status' in responseData) {
          responseStatus = (responseData as { status: number }).status
        }
      } else {
        responseData = response
      }

      // Build response headers
      const responseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      }

      // Return mock response
      return HttpResponse.json(
        responseData as Record<string, unknown> | string | number | boolean | null,
        {
          status: responseStatus,
          headers: responseHeaders,
        },
      )
    } catch (error) {
      // Handle errors in mock response generation
      console.error(`[MSW] Error in handler for ${method} ${path}:`, error)
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }
  })
}

/**
 * Creates multiple handlers from an array of configurations
 */
export function createHandlers(configs: MockEndpointConfig[]) {
  return configs
    .map(createHandler)
    .filter((handler): handler is NonNullable<typeof handler> => handler !== null)
}
