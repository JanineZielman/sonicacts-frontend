import React, {useState, useEffect, useRef} from "react"
import { useRouter } from 'next/router'

const Collapsible = ({children, trigger, open}) => {
	const router = useRouter()
  const [openDiv, setOPenDiv] = useState(open);
	const contentRef = useRef();

	useEffect(() => {
		setTimeout(function() {
			if (document.getElementById(window.location.hash.replace('#', '') + "-content")){
				document.getElementById(window.location.hash.replace('#', '') + "-content").style.height = document.getElementById(window.location.hash.replace('#', '') + "-content").scrollHeight + 'px'
				window.scrollTo({
					top: document.getElementById(window.location.hash.replace('#', ''))?.offsetTop,
					behavior: 'smooth'
				});
			}
		}, 100);
	})


	const toggle = (e) => {
  	setOPenDiv(!openDiv);
		if (openDiv == false){
			router.push(`#${e.target.parentElement.id}`);
		} else {
			router.push(`#${e.target.id}`);
		}
	};

  return (
    <div className="Collapsible" id={trigger}>
			<span onClick={toggle} id={`${trigger}-closed`}>{trigger}</span>
			<div className='content-parent' id={`${trigger}-content`} ref={contentRef} style={openDiv ? { height: contentRef.current?.scrollHeight +
  "px" } : { height: "0px" }}>
				<div className='collapsible-content'>{children}</div>
			</div>
		</div>
  );
};

export default Collapsible