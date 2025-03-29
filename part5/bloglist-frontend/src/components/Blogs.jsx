import PropTypes from 'prop-types'
import Blog from './Blog'

const Blogs = ({ blogs, likeHandler, makeDeleteButton }) => {
  return (
    <div className='blogs'>
      {blogs.toSorted(
        (a, b) => b.likes - a.likes
      ).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeHandler={() => likeHandler(blog)}
        >
          {makeDeleteButton(blog)}
        </Blog>
      )}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  likeHandler: PropTypes.func.isRequired,
  makeDeleteButton: PropTypes.func.isRequired
}

export default Blogs