export interface EventInfo {
  id: string;
  name: string;
  description: string;
  date: string;
  image?: string;
  imagePosition?: string;
  imageCount?: number;
  gradient: string;
  textColor: string;
}

export const EVENTS: EventInfo[] = [
  {
    id: "ethrome-2025",
    name: "ETHRome 2025",
    description: "Hacking history, shaping the future",
    date: "October 2025",
    image: "/ethr.JPG",
    gradient: "from-emerald-400 via-teal-500 to-green-600",
    textColor: "text-white"
  },
  {
    id: "htn-2025",
    name: "Hack the North 2025",
    description: "Canada's largest hackathon",
    date: "September 2025",
    image: "/htn2.png",
    gradient: "from-blue-500 to-purple-600",
    textColor: "text-white"
  },
  {
    id: "nyc-2025",
    name: "ETHGlobal New York 2025",
    description: "Building the future of decentralized applications",
    date: "August 2025",
    image: "/nyc2.png",
    imagePosition: "left",
    gradient: "from-orange-500 to-red-600",
    textColor: "text-white"
  }
];

export function getEventById(id: string): EventInfo | undefined {
  return EVENTS.find(event => event.id === id);
}

export function getAllEventIds(): string[] {
  return EVENTS.map(event => event.id);
}
