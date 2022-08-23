import React, { useState } from "react"
import Menu from "./menu"

const Nav = ({ menus, global, page }) => {
  if (page?.attributes?.slug){
    const slug = page?.attributes?.slug;
    var last = slug.substring(slug.lastIndexOf("/") + 1, slug.length);
    var first = slug.substring(slug.indexOf("/"), 0);
  }

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
          <div className="festival-logo">
            <a href={`/${global.attributes.festival_slug}`}>
              <div className={`title random-color`}>
                <div className={`layer1`}>
                  {(global.attributes.festival_title).split("").map(function(char, index){
                  return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 10) + 90 ), '--delay': (Math.floor(Math.random() * 10) * 0.5) + 's'}}>{char}</span>;
                  })}
                </div>
                <div className={`layer2`}>
                  {(global.attributes.festival_title).split("").map(function(char, index){
                  return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 50) + 50 ), '--delay': (Math.floor(Math.random() * 10) * 0.5) + 's'}}>{char}</span>;
                  })}
                </div>
                <div className={`layer3`}>
                  {(global.attributes.festival_title).split("").map(function(char, index){
                  return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 10) + 90 )}}>{char}</span>;
                  })}
                </div>
              </div>
            </a>
          </div>
          <a href={'/' + page?.attributes?.slug}>
            {last?.replace('-', ' ')}
          </a>
        </div>
        <Menu menus={menus} page={page} global={global} first={first}/>
      </div>
    </div>
  )
}

export default Nav
