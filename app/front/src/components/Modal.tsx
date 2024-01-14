import { Modal, Button } from 'react-bootstrap'

// local type definition.
type PropsType = {
  show: boolean
  title: string
  body: string
  messageOK: string
  messageColse: string
  handleOK: () => void
  handleClose: () => void
  styles?: any
}

const MyModal = ({
  show,
  title,
  body,
  messageOK,
  messageColse,
  handleOK,
  handleClose,
  styles,
}: PropsType) => {
  // tsx.
  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {messageColse}
        </Button>
        <Button variant="primary" onClick={handleOK}>
          {messageOK}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyModal
