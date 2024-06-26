import { RefObject } from 'react'
import { Form, FormCheckProps } from 'react-bootstrap'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import styles from './index.module.scss'

export interface FormItem {
  id: string
  type: string
  title?: string
  explanation?: string
  placeholder?: string
  options?: any
  children?: Array<FormCheck>
}
interface FormCheck {
  value: string
  type: FormCheckProps['type']
  label?: string
}

interface MyFormProps {
  formItems: Array<FormItem>
  formRef: RefObject<HTMLFormElement>
  errors: FieldErrors<any>
  register: UseFormRegister<any>
  extraComponent?: React.ReactNode
}

const _Form: React.FC<MyFormProps> = ({
  formItems,
  formRef,
  errors,
  register,
  extraComponent,
}) => {
  return (
    <Form ref={formRef} className={styles.form}>
      {formItems.map((item, index) => {
        const { id, type, title, explanation, placeholder, options, children } =
          {
            ...item,
          }
        return (
          <Form.Group className="mb-3" key={index}>
            {title !== undefined && (
              <Form.Label className={styles.label}>{title}</Form.Label>
            )}
            {explanation !== undefined && (
              <Form.Text className={styles.text} muted>
                {explanation}
              </Form.Text>
            )}
            {(() => {
              switch (type) {
                case 'textarea':
                  return (
                    <Form.Control
                      as={type}
                      placeholder={placeholder}
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
                        const { value, type, label } = {
                          ...item2,
                        }
                        return (
                          <Form.Check
                            key={index2}
                            value={value}
                            type={type}
                            label={label}
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
                      placeholder={placeholder}
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

export default _Form
