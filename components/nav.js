import React, { useState } from "react"
import Link from "next/link"
import Modal from 'react-bootstrap/Modal'
import Image from "./image"
import Menu from "./menu"

const Nav = ({ menus, global, page }) => {
  console.log(page)
  return (
    <div className="menu">
      <div className="menu-wrapper">
        <div className="breadcrumbs">
          <div className="small-logo">
            <Link href="/">
              <a>
                <Image image={global.attributes.logo.data.attributes}/>
              </a>
            </Link>
          </div>
          <Link href={'/' + page.attributes.slug}>
            <a>
              {page.attributes.slug}
            </a>
          </Link>
        </div>
        <Menu menus={menus}/>
      </div>
    </div>
  )
}

export default Nav
