export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const AUTHOR_FULL_NAMES: Record<string, string> = {
  Prem: "Prem Kumar",
  Aditi: "Aditi Rao",
  Mohak: "Mohak Soni",
  Bhavesh: "Bhavesh Patel",
  Chetan: "Chetan Mehta",
  Rohan: "Rohan Gupta",
  Sudarshan: "Sudarshan Iyer",
  Hemant: "Hemant Verma",
  aayush: "Aayush Sharma",
  Naman: "Naman Jain",
  Yashraj: "Yashraj Singh",
};

export function authorFullName(shortName: string): string {
  return AUTHOR_FULL_NAMES[shortName] ?? shortName;
}

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
