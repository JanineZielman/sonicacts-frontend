import LazyLoad from "react-lazyload";

const ArtistCard = ({ item, lazy = false, sizes = "(max-width: 768px) 60vw, 320px", className = "" }) => {
  if (!item) return null;

  const attributes = item.attributes || item;
  const slug = attributes?.slug || "";
  const name = attributes?.name || "";
  const coverImage = attributes?.cover_image?.data?.attributes.url || null;
  const wrapperClass = ["discover-item", "artist-item", className].filter(Boolean).join(" ");
  const href = slug ? `/biennial/biennial-2026/artists/${slug}` : "#";

  const cardContent = (
    <div className="item-wrapper">
      <a href={href}>
        <div className="image">
          <div className="image-inner" style={{ position: "relative", width: "100%", height: "110%" }}>
            {coverImage ? (
              <span className="next-image-fill-wrapper">
                <img
                  src={'https://cms.sonicacts.com/' + coverImage}
                  className="img"
                />
              </span>
            ) : (
              <div className="image-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
        <div className="title">{name}</div>
      </a>
    </div>
  );

  return <div className={wrapperClass}>{lazy ? <LazyLoad height={300}>{cardContent}</LazyLoad> : cardContent}</div>;
};

export default ArtistCard;
