import { render, screen } from '@testing-library/react'
import AddBlog from './AddBlog'
import userEvent from '@testing-library/user-event'

describe('<AddBlog />', () => {
  test('user input is correctly passed to the handler', async () => {
    const addBlog = vi.fn()
    const user = userEvent.setup()
    render(<AddBlog addBlog={addBlog} />)

    const data = {
      title: 'TITLE',
      author: 'AUTHOR',
      url: 'URL'
    }

    for (const [key, value] of Object.entries(data)) {
      await user.type(screen.getByLabelText(key), value)
    }
    await user.click(screen.getByText('add'))

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toStrictEqual(data)
  })
})