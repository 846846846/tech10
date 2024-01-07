'use strict'

// local type definition.
type PropsType = {
  styles: any
}

const NavBar = ({ styles }: PropsType) => {
  return <div className={styles}>NavBar</div>
}

export default NavBar
