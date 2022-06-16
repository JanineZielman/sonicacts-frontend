import Moment from 'moment';

const Hero = ({relations }) => {
	const text = "Sonic Acts Festival 2022 _ Sonic Acts Festival 2022"

  return (
		<>
			<div className="festival-hero">
				{relations.attributes.festival?.map((item, i) => {
					return(
						<div className={`wrapper type`} >
							<div className='bg'>
								<img src="/fes-noise.svg" />
							</div>
							<div className="info">
								<div>
									<h1>{item.title}</h1>
									<div className="date">
										{item.programme} <br/>
										{Moment(item.start_date).format('D MMM')} — {Moment(item.end_date).format('D MMM')}
									</div>
								</div>
								<div className="locations-wrapper">
									<div className='locations'>
										{item.locations?.map((item, i) => {
											return(
												<div className="location">
													{item.location}
												</div>
											)
										})}	
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</>
  )
}


export default Hero
