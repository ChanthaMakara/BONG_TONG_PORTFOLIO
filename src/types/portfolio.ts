export type Project = {
  id: string;
  title: string;
  role: string;
  description: string;
  /** Full URL or public path, e.g. "/images/projects/provida.jpg". Leave undefined to show the placeholder frame. */
  image?: string;
  images?: string[];
  /** Optional video, e.g. "/videos/projects/provida.mp4". Plays in the full-screen preview. */
  video?: string;
  
};

export type ExperienceItem = {
  title: string;
  detail?: string;
  role: string;
  video?: string;
};

export type ExperienceGroup = {
  period: string;
  items: ExperienceItem[];
};

export type TimelineEntry = {
  date: string;
  title: string;
  detail?: string;
};

export type Skill = {
  name: string;
  tier: 'Core' | 'Supporting' | 'Developing';
};

export type NavLink = {
  id: string;
  label: string;
};