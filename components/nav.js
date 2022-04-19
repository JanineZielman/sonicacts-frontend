import React, { useState } from "react"
import Link from "next/link"
import Modal from 'react-bootstrap/Modal'
import Image from "./image"
import Menu from "./menu"

const Nav = ({ menus, global, page }) => {
  return (
    <div className="menu">
      <div className="menu-wrapper">
        <div className="breadcrumbs">
          <div className="logo-wrapper">
            <Link href="/">
              <a>
                <div className="logo-small">
                  <span  data-text="S" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
                  <span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
                  <span  data-text="n" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
                  <span  data-text="i" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
                  <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                    &nbsp;
                  <span  data-text="A" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
                  <span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                  <span  data-text="t" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
                  <span  data-text="s" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
                </div>
              </a>
            </Link>
          </div>
          <Link href={'/' + page?.attributes?.slug}>
            <a>
              {page.attributes?.slug}
            </a>
          </Link>
        </div>
        <Menu menus={menus}/>
      </div>
    </div>
  )
}

export default Nav
