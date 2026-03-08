import Image from 'next/image';
import { notFound } from 'next/navigation';
import BookEvent from "@/components/BookEvent"
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import { IEvent } from '@/database/event.model';
import EventCard from '@/components/EventCard';

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
    let bookings = 10;
    const eventSimilars:IEvent[] = await getSimilarEventsBySlug(slug)    
    
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

                <EventAgenda agendaItems={event.agenda} />

                <section>
                    <h2>About the Organizer</h2>
                    <p>{event.organizer}</p>
                </section>

                <EventTags tags={event.tags} />
            </div>

            <aside className='booking'>
                <div className="signup-card">
                    <h2>Book your Spot</h2>
                        {
                            bookings >0 ? 
                            (
                                <p className="text-sm">
                                    Join {bookings} people who have already booked their spot!

                                </p>
                            )
                            :
                            (
                                <p className="text-sm">
                                    Be the first to book your spot!
                                </p>
                            )
                        }
                        <BookEvent />
                </div>
            </aside>

        </div>

        <div className="flex w-full flex-col gap-4 pt-10">
            <h2>Similar Events</h2>
            <div className="events">
                {eventSimilars.length>0 && eventSimilars.map((item:IEvent)=>(
                    <EventCard key={item._id} {...item}/>
                ))}
               
            </div>
        </div>
    </section>
  )
}

export default EventDetailPage
