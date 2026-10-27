import { expect, test, type Locator, type Page } from '@playwright/test'

import {
  adminEmail,
  adminPassword,
  commentText,
  seededPosts,
  targetPost,
} from './env'

const manualReviewMode = process.env.E2E_MANUAL_REVIEW === 'true'

async function maybeFill(page: Page, label: RegExp, value: string) {
  const field = page.getByLabel(label)

  if (await field.count()) {
    await field.fill(value)
  }
}

async function fillFirst(locator: Locator, value: string) {
  await expect(locator.first()).toBeVisible()
  await locator.first().fill(value)
}

async function fillVisiblePasswordFields(page: Page, value: string) {
  const namedPassword = page.locator('input[name="password"]')
  const namedConfirmPassword = page.locator('input[name="confirmPassword"]')

  if (await namedPassword.count()) {
    await fillFirst(namedPassword, value)
  }

  if (await namedConfirmPassword.count()) {
    await fillFirst(namedConfirmPassword, value)
    return
  }

  const visiblePasswordInputs = page.locator('input[type="password"]:visible')
  const count = await visiblePasswordInputs.count()

  for (let index = 0; index < count; index += 1) {
    await visiblePasswordInputs.nth(index).fill(value)
  }
}

async function expectDashboard(page: Page, timeout = 15000) {
  await expect(page).toHaveURL(/\/admin\/?$/, { timeout })
  await expect(page.getByRole('link', { name: /^posts$/i }).first()).toBeVisible({ timeout })
}

// Only super-admins can manage tenants and run the seed, so the first admin gets that role
async function selectSuperAdminRole(page: Page) {
  await page.locator('#field-roles .rs__control').click()
  await page.locator('.rs__option', { hasText: /^super-admin$/ }).click()
}

async function createFirstAdmin(page: Page) {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/create-first-user/)

  if (await page.locator('input[name="email"]').count()) {
    await fillFirst(page.locator('input[name="email"]'), adminEmail)
  } else {
    await fillFirst(page.getByLabel(/email/i), adminEmail)
  }

  await maybeFill(page, /^name$/i, 'Playwright Admin')
  await fillVisiblePasswordFields(page, adminPassword)
  await selectSuperAdminRole(page)

  await page
    .getByRole('button', {
      name: /create( first user)?|continue|create/i,
    })
    .first()
    .click({ force: true })

  await expectDashboard(page)

  const meResponse = await page.request.get('/api/users/me')
  expect(meResponse.ok()).toBeTruthy()
  const { user } = await meResponse.json()
  expect(user?.roles).toContain('super-admin')
}

// Seeds the demo tenant for the host the tests run on, so the public pages resolve to it
async function seedDatabase(page: Page) {
  const response = await page.request.post('/next/seed', { timeout: 120000 })

  expect(response.status(), await response.text()).toBe(200)
}

async function getPostID(page: Page, slug: string) {
  const response = await page.request.get('/api/posts', {
    params: {
      depth: '0',
      limit: '1',
      'where[slug][equals]': slug,
    },
  })

  expect(response.ok()).toBeTruthy()

  const body = await response.json()
  const id = body.docs[0]?.id

  if (!id) {
    throw new Error(`Seeded post ${slug} not found`)
  }

  return id as number
}

async function approveComment(page: Page) {
  await page.goto('/admin/collections/comments')

  const commentLink = page.getByRole('link', { name: commentText }).first()
  await expect(commentLink).toBeVisible({ timeout: 30000 })
  await commentLink.click()

  const isApproved = page.getByRole('checkbox', { name: /is approved/i })
  const saveButton = page.getByRole('button', { name: /^save$/i }).first()

  await expect(isApproved).toBeVisible()
  if (!(await isApproved.isChecked())) {
    await isApproved.click()
  }

  if (await saveButton.isDisabled()) {
    await isApproved.click()
    await isApproved.click()
  }

  if (await saveButton.isEnabled()) {
    await saveButton.click()
  } else {
    const commentID = page.url().match(/\/comments\/(\d+)/)?.[1]

    if (!commentID) {
      throw new Error('Unable to determine comment ID for approval fallback')
    }

    const response = await page.request.patch(`/api/comments/${commentID}`, {
      data: {
        isApproved: true,
        publishedAt: new Date().toISOString(),
      },
    })

    if (!response.ok()) {
      throw new Error(`Comment approval fallback failed with status ${response.status()}`)
    }

    await page.reload()
  }

  await expect(isApproved).toBeChecked()
}

async function getApprovedCommentCount(page: Page) {
  const response = await page.request.get('/api/comments', {
    params: {
      depth: '0',
      limit: '10',
      'where[content][equals]': commentText,
      'where[isApproved][equals]': 'true',
    },
  })

  expect(response.ok()).toBeTruthy()

  const body = await response.json()

  return body.docs.length as number
}

async function verifySeededPosts(page: Page) {
  await page.goto('/posts')

  for (const post of seededPosts) {
    await expect(page.getByRole('link', { name: post.title }).first()).toBeVisible()
  }

  for (const post of seededPosts) {
    const response = await page.goto(`/posts/${post.slug}`)

    expect(response?.ok(), `Expected seeded post page /posts/${post.slug} to respond successfully`).toBeTruthy()
    await expect(page.getByRole('heading', { name: post.title })).toBeVisible()
  }
}

// The post pages no longer render a comment form, so visitors' comments go through the public API
async function submitPublicComment(page: Page, postID: number) {
  const response = await page.request.post('/api/comments', {
    data: {
      content: commentText,
      author: { name: 'Playwright Visitor', email: 'visitor@example.com' },
      post: postID,
    },
  })

  expect(response.status(), await response.text()).toBe(201)
}

test('supports onboarding, seeding, and comment moderation', async ({ browser, page }) => {
  await createFirstAdmin(page)
  await seedDatabase(page)

  const publicContext = await browser.newContext()
  const publicPage = await publicContext.newPage()

  await verifySeededPosts(publicPage)

  await submitPublicComment(publicPage, await getPostID(page, targetPost.slug))
  expect(await getApprovedCommentCount(publicPage)).toBe(0)

  await approveComment(page)

  await expect
    .poll(async () => getApprovedCommentCount(publicPage), {
      timeout: 30000,
    })
    .toBe(1)

  if (manualReviewMode) {
    await publicPage.goto(`/posts/${targetPost.slug}`)
    await publicPage.bringToFront()
    await publicPage.pause()
  }

  await publicContext.close()
})

test('redirects www hosts to their apex domain', async ({ request }) => {
  const response = await request.get('/posts?page=2', {
    headers: { host: 'www.example-tenant.nl' },
    maxRedirects: 0,
  })

  expect(response.status()).toBe(308)
  expect(response.headers()['location']).toBe('https://example-tenant.nl/posts?page=2')
})
