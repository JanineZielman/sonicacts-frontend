import React from "react"
import Link from "next/link"

const HomeNav = ({ pages }) => {
  return (
    <section className="homenav">
			<img src="logo.png"/>
			{pages.map((page, i) => {
				return (
					<div id={page.slug} key={'link-'+ i} className="link">
						<Link href={`/${page.slug}`}>
							<a>{page.title}</a>
						</Link>
					</div>
				)
			})}
			<style jsx>{`
        .homenav {
          font-size: 40px;
        }
				img{
					position: absolute;
					top: 42%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
				a{
					color: #fff;
					text-transform: uppercase;
				}
				.link{
					position: absolute;
				}
				#contact{
					top: 5vh;
					left: 15vw;
				}
				#podcast{
					top: 35vh;
					left: 4vw;
				}
				#alternative-economies{
					top: 65vh;
					left: 4vw;
					max-width: 10vw;
				}
				#visa-help{
					top: 5vh;
					right: 14vw;
				}
				#faq{
					top: 35vh;
					right: 4vw;
				}
				#about{
					top: 68vh;
					right: 15vw;
				}
				/* #about{
					top: 75vh;
					right: 40vw;
				} */
      `}</style>
    </section>
  )
}

export default HomeNav
