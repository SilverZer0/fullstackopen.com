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
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]).isRequired,
    isError: PropTypes.bool.isRequired
  }).isRequired
}

export default Notification