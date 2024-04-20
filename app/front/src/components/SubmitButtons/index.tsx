import { Button } from 'react-bootstrap'
import styles from './index.module.scss'

interface SubmitButtonsProps {
  handleSubmit?: any
  onSubmit?: any
  onClose?: any
}

const SubmitButtons: React.FC<SubmitButtonsProps> = ({
  handleSubmit,
  onSubmit,
  onClose,
}) => {
  return (
    <div className={styles.container}>
      {onClose !== undefined && (
        <Button
          className={styles.cancel}
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          キャンセル
        </Button>
      )}
      <Button
        className={styles.ok}
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
