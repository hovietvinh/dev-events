import Image from 'next/image';
import { notFound } from 'next/navigation';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({icon, alt, label}:{icon: string, alt:string, label:string})=>{
    return (
        <>
            <div className="flex-row-gap-2 items-center">
                <Image src={icon} alt={alt} width={17} height={17} />
                <p>{label}</p>
            </div>
        </>    
    )
}

const EventAgenda = ({agendaItems} : {agendaItems: string[]})=>{
    return (
        <>
            <div className="agenda">
                <h2>Agenda</h2>
                <ul>
                    {
                        agendaItems.map((item) => (
                            <li className="list-disc" key={item}>{item}</li>
                        ))
                    }
                </ul>
            </div>  
        </>
    )

}

const EventTags = ({tags} : {tags: string[]}) => {
    return (
        <>
            <div className="flex flex-row gap-1.5 flex-wrap">
                {
                    tags.map((tag) => (
                        <span className="pill" key={tag}>{tag}</span>
                    ))
                }
            </div>  
        </>
    )
}

const EventDetailPage = async({params}:{params: Promise<{ slug: string }>}) => {
    const {slug} =await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`)
    const { event} = await response.json()
    if(!event) {
        return notFound()
    }
    
  return (
    <section id="event">
        <div className="header">
            <h1>Event Description</h1>
            <p>{event.description}</p>
        </div>
        <div className="details">
            <div className="content">
                <Image
                    src={event.image}
                    alt={event.title}
                    width={800}
                    height={800}
                    className="banner"
                />

                <section className="flex-col-gap-2">
                      <h2>Overview</h2>
                      <p>{event.overview}</p>
                </section>

                <section className="flex-col-gap-2">
                      <h2>Event Details</h2>
                      <EventDetailItem icon={"/icons/calendar.svg"} alt="calender" label={event.date} />
                      <EventDetailItem icon={"/icons/clock.svg"} alt="clock" label={event.time} />
                      <EventDetailItem icon={"/icons/pin.svg"} alt="pin" label={event.location} />
                      <EventDetailItem icon={"/icons/mode.svg"} alt="mode" label={event.mode} />
                      <EventDetailItem icon={"/icons/audience.svg"} alt="audience" label={event.audience} />
                </section>

                <EventAgenda agendaItems={event.agenda[0].split(',')} />

                <section>
                    <h2>About the Organizer</h2>
                    <p>{event.organizer}</p>
                </section>

                <EventTags tags={event.tags[0].split(",")} />
            </div>
            
            <aside className='booking'>
                <p className='text-lg font-semibold'>Book Event</p>
            </aside>

        </div>
    </section>
  )
}

export default EventDetailPage
