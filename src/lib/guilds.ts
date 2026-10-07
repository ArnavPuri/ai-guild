export interface Guild {
  id: string;
  code: string;
  name: string;
  /** Who belongs to this guild. */
  audience: string;
  /** Typical jobs the guild's patterns cover. */
  covers: string;
  /** Agents and personas in this guild must carry a "## Boundaries" section. */
  requiresBoundaries: boolean;
}

export const GUILDS: Guild[] = [
  { id: 'teachers', code: 'G-01', name: 'Teachers', audience: 'Teachers, tutors, school leaders', covers: 'Lesson plans, marking, parent emails', requiresBoundaries: false },
  { id: 'healers', code: 'G-02', name: 'Healers', audience: 'Doctors, nurses, therapists, pharmacists', covers: 'Patient explainers, notes, referrals', requiresBoundaries: true },
  { id: 'builders', code: 'G-03', name: 'Builders', audience: 'Developers and engineers', covers: 'Reviews, PRs, triage, release notes', requiresBoundaries: false },
  { id: 'makers', code: 'G-04', name: 'Makers', audience: 'Designers of every kind', covers: 'Critique, UX copy, accessibility', requiresBoundaries: false },
  { id: 'merchants', code: 'G-05', name: 'Merchants', audience: 'Sales and account teams', covers: 'Qualifying, call prep, follow-ups', requiresBoundaries: false },
  { id: 'heralds', code: 'G-06', name: 'Heralds', audience: 'Marketing and content teams', covers: 'Launch plans, posts, newsletters', requiresBoundaries: false },
];

export const GUILD_IDS = GUILDS.map((g) => g.id) as [string, ...string[]];

export function getGuild(id: string): Guild {
  const guild = GUILDS.find((g) => g.id === id);
  if (!guild) throw new Error(`Unknown guild "${id}"`);
  return guild;
}
