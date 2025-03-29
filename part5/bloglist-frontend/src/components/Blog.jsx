import { useState } from 'react'

const Blog = ({ blog, likeHandler, children }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <div className="blog">
      {blog.title} {blog.author}&nbsp;
      <button
        onClick={() => { setDetailsVisible(!detailsVisible) }}>
        {detailsVisible ? 'hide' : 'show'}
      </button>
      <div style={{ display: detailsVisible ? '' : 'none' }}>
        {blog.url}
        <br />
        likes {blog.likes}&nbsp;
        <button
          onClick={likeHandler}>
          like
        </button>
        <br />
        {blog.user.name}
        {children}
      </div>
    </div>
  )
}

export default Blog