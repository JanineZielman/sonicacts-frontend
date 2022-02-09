import React, { useState } from "react"
import Link from "next/link"
import Modal from 'react-bootstrap/Modal'

const Menu = ({ pages }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <>

      <div className="hamburger" onClick={handleShow}>
        <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="49" y1="1" x2="1" y2="1" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          <line x1="49" y1="16" x2="1" y2="16" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          <line x1="49" y1="31" x2="1" y2="31" stroke="black" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      </div>
      
      <Modal show={show} onHide={handleClose} className="menu-modal">
        <div onClick={handleClose} className="close">
          <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
            <line x1="1" y1="-1" x2="44.6296" y2="-1" transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          </svg>
        </div>
        <div className="menu-links" onClick={handleClose}>
          <Link href="/">
            <a className="home">Sonic <br/> Acts</a>
          </Link>
          {pages.map((page, i) => {
            return (
              <Link href={page.attributes.slug} key={'link'+i}>
                <a className="menu-link">{page.attributes.slug}</a>
              </Link>
            )
          })}
        </div>
      </Modal>

    </>
  )
}

export default Menu
