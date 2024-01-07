'use strict'
import { Button } from 'react-bootstrap'

// local type definition.
type PropsType = {
  styles: any
  handleSubmit?: any
  onSubmit?: any
  onClose?: any
}

const SubmitButtons = ({
  styles,
  handleSubmit,
  onSubmit,
  onClose,
}: PropsType) => {
  return (
    <div className={styles.buttonContainer}>
      {onClose !== undefined && (
        <Button
          className={styles.buttonCancel}
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          キャンセル
        </Button>
      )}
      <Button
        className={styles.buttonOk}
        variant="primary"
        size="sm"
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        OK
      </Button>
    </div>
  )
}

export default SubmitButtons
