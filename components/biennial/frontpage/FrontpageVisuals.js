import ActsSvg from "./ActsSvg"
import SonicSvg from "./SonicSvg"

const IMAGE_BASE_PATH = "/biennial/biennial-2026/assets/frontpage"

const FrontpageVisuals = () => (
  <>
    <div id="biennial-date" className="intro-fade-target" data-intro-step="4">
      <img
        src={`${IMAGE_BASE_PATH}/250923-SonicActs-2026-WebSketch-01.svg`}
        alt="Sonic Acts Biennial date"
      />
    </div>

    <div id="biennial-title" className="intro-fade-target" data-intro-step="4">
      <img
        src={`${IMAGE_BASE_PATH}/250923-SonicActs-2026-WebSketch-02.svg`}
        alt="Sonic Acts Biennial title"
      />
    </div>

    <div
      id="biennial-title-date-mobile"
      className="intro-fade-target"
      data-intro-step="4"
    >
      <img
        src={`${IMAGE_BASE_PATH}/250930-SAB-2026-Mobile.svg`}
        alt="Sonic Acts Biennial date and title"
      />
    </div>
  </>
)

export default FrontpageVisuals
