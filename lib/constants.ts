export type EventItem = {
    title: string;
    image: string;
    slug : string;
    location: string;
    date: string;
    time: string;
}

export const events: EventItem[] = [
    {
      title: "Hack the Future 2024",
      image: "/images/event1.png",
      slug: "hack-the-future-2024",
      location: "San Francisco, CA",
      date: "2024-09-15",
      time: "10:00 AM - 6:00 PM",
    },
    {
      title: "CodeCon 2024",
      image: "/images/event2.png",
      slug: "codecon-2024",
      location: "New York, NY",
      date: "2024-10-20",
      time: "9:00 AM - 5:00 PM",
    },
    {
      title: "DevSummit 2024",
      image: "/images/event3.png",
      slug: "devsummit-2024",
      location: "Austin, TX",
      date: "2024-11-05",
      time: "8:00 AM    - 4:00 PM",
    },
    {
      title: "Tech Innovators Conference 2024",
      image: "/images/event4.png",
      slug: "tech-innovators-conference-2024",
      location: "Seattle, WA",
      date: "2024-12-10",
      time: "9:30 AM - 5:30 PM",
    }
] 