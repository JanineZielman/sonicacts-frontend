const Nav = ({ festival }) => {
  return (
    <>
      {festival?.attributes?.radio && (
        <div className="radio">
          <div
            className="radio-wrapper"
            dangerouslySetInnerHTML={{ __html: festival.attributes.radio }}
          />
          <p className="mobile-radio">
            {festival.attributes.mobile_radio_text}
          </p>
        </div>
      )}
      <div
        className={`menu ${festival?.attributes?.radio ? "topbanner" : ""}`}
      ></div>
    </>
  )
}

export default Nav
