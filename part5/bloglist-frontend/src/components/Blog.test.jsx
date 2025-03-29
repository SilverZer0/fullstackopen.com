import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const nop = () => { }
  const blog = {
    id: 0,
    title: 'TITLE',
    author: 'AUTHOR',
    url: 'URL',
    likes: 42,
    user: {
      name: 'NAME'
    }
  }

  test('title and author are displayed', () => {
    render(
      <Blog
        key={blog.id}
        blog={blog}
        likeHandler={nop}
      />
    )

    expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
    expect(screen.getByText(blog.author, { exact: false })).toBeDefined()
    expect(screen.getByText(blog.url, { exact: false })).toHaveStyle('display: none')
    expect(screen.getByText(blog.likes, { exact: false })).toHaveStyle('display: none')
  })

  test('details are shown when show-button is pressed', async () => {
    render(
      <Blog
        key={blog.id}
        blog={blog}
        likeHandler={nop}
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)
    expect(screen.getByText(blog.url, { exact: false }))
      .not.toHaveStyle('display: none')
    expect(screen.getByText(blog.likes, { exact: false }))
      .not.toHaveStyle('display: none')
  })

  test('like-function is called twice if button is pressed twice', async () => {
    const mockHandler = vi.fn()
    render(
      <Blog
        key={blog.id}
        blog={blog}
        likeHandler={mockHandler}
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})