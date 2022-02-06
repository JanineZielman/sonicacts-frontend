import React, { useState } from "react"
import Link from "next/link"
import Modal from 'react-bootstrap/Modal'

const Nav = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <a>Menu</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>Search</a>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <div onClick={handleShow} className="login-button">
              <a>Log in</a>
            </div>
            <Modal show={show} onHide={handleClose} className="login">

              modal
              <button variant="secondary" onClick={handleClose} className="close">
                x
              </button>
            </Modal>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
