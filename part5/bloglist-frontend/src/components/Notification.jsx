import PropTypes from 'prop-types'

const Notification = ({ notification: { message, isError } }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={(isError ? 'error' : 'info') + ' notification'}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    isError: PropTypes.bool
  }).isRequired
}

export default Notification