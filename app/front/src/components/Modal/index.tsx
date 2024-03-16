import { Modal, Button } from 'react-bootstrap'
import styles from './index.module.scss'

interface ModalProps {
  show: boolean
  title: string
  body: string
  messageOK: string
  messageColse: string
  handleOK: () => void
  handleClose: () => void
}

const _Modal: React.FC<ModalProps> = ({
  show,
  title,
  body,
  messageOK,
  messageColse,
  handleOK,
  handleClose,
}) => {
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

export default _Modal
