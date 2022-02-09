import React, { useState } from "react"
import Link from "next/link"
import Modal from 'react-bootstrap/Modal'
import Image from "./image"
import Menu from "./menu"

const Nav = ({ pages, global }) => {
  
  return (
    <div className="menu">
      <div className="breadcrumbs">
        <div className="small-logo">
          <Link href="/">
            <a>
              <Image image={global.attributes.logo.data.attributes}/>
            </a>
          </Link>
        </div>
      </div>
     
     <Menu pages={pages}/>

    </div>
  )
}

export default Nav
