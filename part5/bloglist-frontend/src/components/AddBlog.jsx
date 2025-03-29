import PropTypes from 'prop-types'
import { useState } from 'react'

const AddBlog = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlogHandler = async (event) => {
    event.preventDefault()
    if (await addBlog({ title, author, url })) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div className='addBlog'>
      <h3>add Blog</h3>
      <form onSubmit={addBlogHandler}>
        <div>
          <label>
            title&nbsp;
            <input
              type='text' value={title} name='Title'
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author&nbsp;
            <input
              type='text' value={author} name='Author'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url&nbsp;
            <input
              type='text' value={url} name='Url'
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

AddBlog.propTypes = {
  addBlog: PropTypes.func.isRequired
}


export default AddBlog