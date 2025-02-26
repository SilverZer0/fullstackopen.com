import { useState } from 'react'

const AddBlog = ({ makeAddNoteHandler }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const resetInputs = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const addNoteHandler = makeAddNoteHandler(title, author, url, resetInputs)

  return (
    <div>
      <h3>add Blog</h3>
      <form onSubmit={addNoteHandler}>
        <div>
          title:
          <input
            type='text' value={title} name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text' value={author} name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text' value={url} name='Url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default AddBlog