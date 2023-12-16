'use strict'
import { RefObject } from 'react'
import { Form, FormCheckProps } from 'react-bootstrap'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

// local type definition.
export type FormItem = {
  id: any
  type: string
  note: string
  children?: Array<FormCheck>
  options?: any
}
type FormCheck = {
  value: string
  type: FormCheckProps['type']
  note: string
}
type MyProps = {
  formItems: Array<FormItem>
  formRef: RefObject<HTMLFormElement>
  errors: FieldErrors<any>
  register: UseFormRegister<any>
  styles: any
  extraComponent?: React.ReactNode
}

const MyForm = ({
  formItems,
  formRef,
  errors,
  register,
  styles,
  extraComponent,
}: MyProps) => {
  return (
    <Form ref={formRef} className={styles.form}>
      {formItems.map((item, index) => {
        const { note, type, id, options, children } = { ...item }
        return (
          <Form.Group className="mb-3" key={index}>
            {(() => {
              switch (type) {
                case 'textarea':
                  return (
                    <Form.Control
                      as={type}
                      placeholder={note}
                      rows={3}
                      isInvalid={errors[id] !== undefined}
                      {...register(id, options)}
                    />
                  )
                case 'check':
                  return (
                    <Form.Group
                      controlId="checkGroup"
                      className={styles.roleCheckBox}
                    >
                      {children?.map((item2, index2) => {
                        const { value, type, note } = {
                          ...item2,
                        }
                        return (
                          <Form.Check
                            key={index2}
                            value={value}
                            type={type}
                            label={note}
                            {...register('role', options)}
                          />
                        )
                      })}
                    </Form.Group>
                  )
                default:
                  return (
                    <Form.Control
                      type={type}
                      placeholder={note}
                      isInvalid={errors[id] !== undefined}
                      {...register(id, options)}
                    />
                  )
              }
            })()}
            {errors[id] && (
              <Form.Text className={styles.error}>
                {errors[id]?.message as string}
              </Form.Text>
            )}
          </Form.Group>
        )
      })}
      {extraComponent}
    </Form>
  )
}

export default MyForm
