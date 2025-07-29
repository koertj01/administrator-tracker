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

export const testEvents: ScheduleEvent[] = [
  {
    memberId: "m1",
    date: today,
    title: "Code Review",
    color: "#2196f3",
  },
  {
    memberId: "m1",
    date: addDays(today, 1),
    title: "Sprint Planning",
    color: "#4caf50",
  },
  {
    memberId: "m2",
    date: today,
    title: "Bug Fixing",
    color: "#f44336",
  },
  {
    memberId: "m4",
    date: addDays(today, 2),
    title: "Design Review",
    color: "#ff9800",
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