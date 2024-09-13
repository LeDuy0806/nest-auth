import { RedisKeys } from '~/constants/cache.constant'

// generate redis key for blacklisted access token
export function genTokenBlacklistKey(tokenId: string) {
  return `${RedisKeys.TOKEN_BLACKLIST_PREFIX}${String(tokenId)}` as const
}
