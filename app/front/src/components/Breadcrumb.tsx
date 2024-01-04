import Link from 'next/link'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

// local type definition.
type PropsType = {
  styles: any
}

const MyBreadcrumb = ({ styles }: PropsType) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#">ホーム</Breadcrumb.Item>
      <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
        Library
      </Breadcrumb.Item>
      <Breadcrumb.Item active>Data</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default MyBreadcrumb
