// import cluster from 'node:cluster'

// export const isMainCluster = process.env.NODE_APP_INSTANCE && Number.parseInt(process.env.NODE_APP_INSTANCE) === 0
// export const isMainProcess = cluster.isPrimary || isMainCluster

export const isDev = process.env.NODE_ENV === 'development'

export const isTest = !!process.env.TEST
export const cwd = process.cwd()

/**
 * Basic type interface
 */
export type BaseType = boolean | number | string | undefined | null

/**
 * format value from environment variable
 * @param key key of environment variable
 * @param defaultValue default value
 * @param callback callback function to format value
 */
function formatValue<T extends BaseType = string>(
  key: string,
  defaultValue: T = undefined,
  callback?: (value: string) => T
): T {
  const value: string | undefined = process.env[key]
  if (typeof value === 'undefined' || value === '') {
    if (defaultValue === undefined || defaultValue === '') {
      throw new Error(`${key} environment variable is not defined`)
    }
    return defaultValue
  }

  if (!callback) return value as unknown as T

  return callback(value)
}

export function env(key: string, defaultValue: string = '') {
  return formatValue(key, defaultValue)
}

export function envString(key: string, defaultValue: string = '') {
  return formatValue(key, defaultValue)
}

export function envNumber(key: string, defaultValue: number = 0) {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Number(value)
    } catch {
      throw new Error(`${key} environment variable is not a number`)
    }
  })
}

export function envBoolean(key: string, defaultValue: boolean = false) {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Boolean(JSON.parse(value))
    } catch {
      throw new Error(`${key} environment variable is not a boolean`)
    }
  })
}
