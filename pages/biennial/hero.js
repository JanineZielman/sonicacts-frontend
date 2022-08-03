import Moment from 'moment';

const Hero = ({relations }) => {
  return (
		<>
			<div className="festival-hero">
				{relations.attributes.festival?.map((item, i) => {
					return(
						<div className={`wrapper type`} >
							<div className='bg'></div>
							<div className="info">
								<div>
									<h1>{item.programme}</h1>
									<div className="date">
										{item.title &&
											<>
												{item.title} <br/>
											</>
										}
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
