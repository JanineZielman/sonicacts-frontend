import React,  { useState } from "react"
import { CSSTransition } from 'react-transition-group';
import Link from "next/link"
import Modal from 'react-modal';
import Search from '../components/search'

const Menu = ({ menus }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const modalStyles = {
    overlay: {
      backgroundColor: 'transparent',
    },
  };
  
  return (
    <>
      <div className="menu-search">
        <Search/>
      </div>
      <div className="hamburger" onClick={handleShow}>
        <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="49" y1="1" x2="1" y2="1" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          <line x1="49" y1="16" x2="1" y2="16" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          <line x1="49" y1="31" x2="1" y2="31" stroke="black" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      </div>
      <CSSTransition
        in={show}
        timeout={300}
        classNames="dialog"
      >
        <Modal  isOpen={show} onHide={handleClose} className={'menu-modal'} ariaHideApp={false} closeTimeoutMS={500} style={modalStyles}>
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
            {menus.map((page, i) => {
              return (
                page.attributes.slug != 'shop' ?

                <Link href={'/'+page.attributes.slug} key={'link'+i}>
                  <a className="menu-link">{page.attributes.slug}</a>
                </Link>
                :
                <Link href={'https://sonicacts.com/sashop/'} key={'link'+i}>
                  <a className="menu-link" target={'_blank'}>{page.attributes.slug}</a>
                </Link>
          
              )
            })}
          </div>
        </Modal>
      </CSSTransition>

    </>
  )
}

export default Menu
