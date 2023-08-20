'use strict'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { MemoClass, APIType } from '../webapi/memo'
import styles from '../styles/memo.module.scss'

export type Memo = {
  id: string
  title: string
  mainText: string
  updateAt: string
}

export type EditProps = {
  type: APIType
  show: boolean
  handleClose: () => void
  memo?: Memo
}

const Edit = (props: EditProps) => {
  // props.
  const { type, show, handleClose, memo } = { ...props }

  // hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Memo>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    reset(memo)
  }, [memo, reset])

  // handler.
  const onSubmit = async (data: any) => {
    const api = new MemoClass()
    const res = await api[type](data)
    handleClose()
  }

  const modalTitle = (type: APIType) => {
    switch (type) {
      case 'update':
        return '編集'
      case 'delete':
        return '削除'
      case 'create':
      default:
        return '新規作成'
    }
  }

  const readonly = type === 'delete' ? true : false

  return (
    <Modal show={show} onHide={handleClose} className={styles.edit}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle(type)}</Modal.Title>
      </Modal.Header>

      <Form ref={formRef}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>タイトル</Form.Label>
            <Form.Control
              readOnly={readonly}
              type="text"
              {...register('title')}
            />
            <Form.Label>本文</Form.Label>
            <Form.Control
              as="textarea"
              readOnly={readonly}
              {...register('mainText')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancels
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default Edit
