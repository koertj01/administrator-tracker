import { TeamGroup, ScheduleEvent, Availability } from "./ScheduleGrid.types";
import { addDays, subDays } from "date-fns";

export const today = new Date();

export const testTeamGroups: TeamGroup[] = [
  {
    name: "Engineering",
    members: [
      { id: "m1", name: "Alice Smith", role: "Senior Developer" },
      { id: "m2", name: "Bob Johnson", role: "Developer" },
      { id: "m3", name: "Carol Williams", role: "Tech Lead" },
    ],
  },
  {
    name: "Design",
    members: [
      { id: "m4", name: "David Brown", role: "UI/UX Designer" },
      { id: "m5", name: "Emma Davis", role: "Graphic Designer" },
    ],
  },
];

export const testEvents = [
  {
    id: "evt-1",
    memberId: "m1",
    title: "Code Review",
    color: "#2196f3",
    date: new Date(2025, 7, 11), // Aug 11 2025
  },
  {
    id: "evt-2",
    memberId: "m2",
    title: "Sprint Planning",
    color: "#4caf50",
    date: new Date(2025, 7, 12),
  },
  {
    id: "evt-3",
    memberId: "m3",
    title: "Bug Fixing",
    color: "#ff9800",
    date: new Date(2025, 7, 13),
  },
];

export const testAvailabilities: Availability[] = [
  { memberId: "m1", date: today, status: "available" },
  { memberId: "m1", date: addDays(today, 1), status: "unavailable" },
  { memberId: "m2", date: today, status: "tentative" },
  { memberId: "m2", date: addDays(today, 1), status: "available" },
  { memberId: "m3", date: subDays(today, 1), status: "unavailable" },
  { memberId: "m4", date: addDays(today, 2), status: "available" },
  { memberId: "m5", date: today, status: "unavailable" },
];