import React, { useState } from "react"
import Menu from "./menu"

const Nav = ({ menus, global, page }) => {
  const slug = page.attributes.slug;
  var last = slug.substring(slug.lastIndexOf("/") + 1, slug.length);
  return (
    <div className="menu">
      <div className="menu-wrapper">
        <div className="breadcrumbs">
          <div className="logo-wrapper">
            <a href="/">
              <div className="logo-small">
                <span  data-text="S" className="glitch s" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
                <span  data-text="o" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
                <span  data-text="n" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
                <span  data-text="i" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
                <span  data-text="c" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                  &nbsp;
                <span  data-text="A" className="glitch a" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
                <span  data-text="c" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
                <span  data-text="t" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
                <span  data-text="s" className="glitch hide-for-mobile" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
              </div>
            </a>
          </div>
          <a href={'/' + page?.attributes?.slug}>
            {last.replace('-', ' ')}
          </a>
        </div>
        <Menu menus={menus} page={page} global={global}/>
      </div>
    </div>
  )
}

export default Nav
