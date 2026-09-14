import test from 'node:test'
import assert from 'node:assert/strict'

import { resolvePdfUrl } from '../docs/.vitepress/theme/utils/pdf-url.js'

test('uses the local asset URL outside production', () => {
  const url = resolvePdfUrl(
    'docs/md/books/ai-software/Agents_Companion_v2.pdf',
    '/assets/Agents_Companion_v2.pdf',
    false
  )

  assert.equal(url, '/assets/Agents_Companion_v2.pdf')
})

test('uses an encoded GitHub Raw URL in production', () => {
  const url = resolvePdfUrl(
    'docs/md/books/ai-software/Claude_Prompt_Library_分类索引+模板_2026-02-14.pdf',
    '/local.pdf',
    true
  )

  assert.equal(
    url,
    'https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/docs/md/books/ai-software/Claude_Prompt_Library_%E5%88%86%E7%B1%BB%E7%B4%A2%E5%BC%95%2B%E6%A8%A1%E6%9D%BF_2026-02-14.pdf'
  )
})
