const GITHUB_RAW_ROOT =
  'https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/'

const encodeRepoPath = (repoPath) =>
  repoPath.split('/').map(encodeURIComponent).join('/')

export const resolvePdfUrl = (repoPath, localUrl, production = import.meta.env?.PROD) => {
  if (!production) return localUrl
  return new URL(encodeRepoPath(repoPath), GITHUB_RAW_ROOT).href
}
