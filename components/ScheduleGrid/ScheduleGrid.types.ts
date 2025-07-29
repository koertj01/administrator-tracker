export interface Member {
    id: string;
    name: string;
    role: string;
  }
  
  export interface TeamGroup {
    name: string;
    members: Member[];
  }
  
  export interface ScheduleEvent {
    memberId: string;
    date: Date;
    title: string;
    color?: string;
  }
  
  export interface Availability {
    memberId: string;
    date: Date;
    status: "available" | "unavailable" | "tentative";
  }
  
  export interface ScheduleGridProps {
    startDate: Date;
    endDate: Date;
    teamGroups: TeamGroup[];
    onCellClick?: (data: Member | { memberId: string; day: Date }[], day?: Date) => void;
    events?: ScheduleEvent[];
    availabilities?: Availability[];
  }