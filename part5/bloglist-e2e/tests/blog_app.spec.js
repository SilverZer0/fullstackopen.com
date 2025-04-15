const { test, expect, beforeEach, describe } = require('@playwright/test')

const login = async (page, user) => {
  await page.getByLabel('username').fill(user.username)
  await page.getByLabel('password').fill(user.password)
  await page.getByRole('button', { name: 'login' }).click()
}

const user = {
  username: 'albertE',
  password: 'Relativitätstheorie'
}

const blogs = {
  own: {
    name: 'First class tests',
    likes: 10
  },
  other: {
    name: 'Canonical string reduction'
  }
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    //I opted to not empty but reset the db as its easier for 5.22 & 5.23
    await request.post('http://localhost:3003/api/testing/dummy')
    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('Login form is shown', async ({ page }) => {
      await expect(page.getByLabel('username')).toBeVisible()
      await expect(page.getByLabel('password')).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, user)
      await expect(page.getByText('Login successful')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, { ...user, password: 'wrong password' })
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('Blogs', () => {
    beforeEach(async ({ page }) => {
      await login(page, user)
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('TITLE')
      await page.getByLabel('author').fill('AUTHOR')
      await page.getByLabel('url').fill('URL')
      await page.getByRole('button', { name: 'add' }).click()

      await expect(page.getByText('TITLE AUTHOR show')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = page.getByText(blogs.own.name, { exact: false })
      await blog.getByRole('button', { name: 'show' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText(`likes ${blogs.own.likes + 1}`, { exact: false })).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      const blog = page.getByText(blogs.own.name, { exact: false })
      await blog.getByRole('button', { name: 'show' }).click()
      page.on('dialog', dialog => dialog.accept());
      await blog.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('Blog was deleted')).toBeVisible()
    })

    test('a blog can\'t be deleted by the wrong user', async ({ page }) => {
      const blog = page.getByText(blogs.other.name, { exact: false })
      await blog.getByRole('button', { name: 'show' }).click()
      expect(await blog.getByRole('button', { name: 'delete' }).count()).toEqual(0)
      //instead of .toHaveCount(0) because that fails in firefox & webkit
    })

    test('the blogs are ordered by like count', async ({ page }) => {
      await expect(page.locator('.blog').first()).toBeVisible() // delay for chrome & firefox
      const likes = (await page.locator('.blog').allTextContents()).map(
        text => /likes (\d+)/.exec(text)[1] * 1
      )
      expect(likes).not.toEqual([])
      expect(likes).toEqual([...likes].sort((a, b) => b - a))
    })
  })
})