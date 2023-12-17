'use strict'

// local type definition.
type propsType = {
  styles: any
}

const NavBar = ({ styles }: propsType) => {
  return <div className={styles}>NavBar</div>
}

export default NavBar
