import type { Skill, TimelineEntry } from '../types/portfolio';

export const degree = {
  period: '2020 — 2024',
  start: '2020',
  end: '2024',
  title: 'Bachelor Degree of Film Studies',
  school: 'PSE Film School',
  image: '/images/projects/education.JPG',

};

export const training: TimelineEntry[] = [
{ date: 'Jan 2024', title: 'Directing Workshop', detail: 'with Patrice Leconte' },
{ date: 'Oct 2023', title: 'Cinematography, Directing & Marketing Workshop', detail: 'with Scott Hillier' },
{ date: 'Aug 2023', title: 'Light Workshop', detail: 'Chaktomok Short Film Festival' },
{ date: 'Aug 2023', title: 'Assistant Camera Workshop' },
{ date: '2020 — 2021', title: 'Soft Skill Program', detail: 'PSE' },
{ date: '2020 — 2023', title: 'Scout Leader Training' }];


// Chronological, oldest first
export const volunteering: TimelineEntry[] = [
{ date: 'June 2022', title: 'Assistant Production Manager', detail: 'Cambodia International Film Festival' },
{ date: 'Dec 2022', title: 'Coordinator', detail: 'PSE Winter Camp Program' },
{ date: 'March 2023', title: 'Videographer', detail: 'TEPHATHA Opening Ceremony' },
{ date: 'June 2023', title: 'Photographer', detail: 'Cambodia International Film Festival' }];


export const skills: Skill[] = [
{ name: 'Cinematography', tier: 'Core' },
{ name: 'Lighting', tier: 'Core' },
{ name: 'Photoshooting', tier: 'Core' },
{ name: 'Video Editing', tier: 'Supporting' },
{ name: 'Graphic Design', tier: 'Supporting' },
];