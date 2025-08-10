export interface Member {
    id: string;
    name: string;
    role: string;
  }
  
  export type Layer = { id: string; label: string };
  
  export interface TeamGroup {
    name: string;
    members: Member[];
  }
  
  // export interface ScheduleEvent {
  //   memberId: string;
  //   date: Date;
  //   title: string;
  //   color?: string;
  // }

  export type ScheduleEvent = {
  id: string;
  memberId: string;
  title: string;
  color?: string;
  // NEW (range + layer)
  startDate: Date;
  endDate: Date;
  layerId: string;
  //back-compat if 'date' is present from older test date treat as one day
  date?: Date;
}
  
  export interface Availability {
    memberId: string;
    date: Date;
    status: "available" | "unavailable" | "tentative";
  }
  
  // export interface ScheduleGridProps {
  //   startDate: Date;
  //   endDate: Date;
  //   teamGroups: TeamGroup[];
  //   onCellClick?: (data: Member | { memberId: string; day: Date }[], day?: Date) => void;
  //   events?: ScheduleEvent[];
  //   availabilities?: Availability[];
  // }

  export type ScheduleGridProps = {
    startDate: Date;
    endDate: Date;
    teamGroups: { name: string; members: { id: string; name: string; role?: string }[] }[];
    events?: ScheduleEvent[];
    availabilities?: Availability[];
    onCellClick?: (selection: { memberId: string; day: Date }[] | (member: { id: string }, day: Date)) => void;
  
    // NEW callbacks (all optional, component stays “controlled-friendly”)
    onCreateEvent?: (args: { memberId: string; layerId: string; startDate: Date; endDate: Date }) => void;
    onResizeEvent?: (args: { eventId: string; startDate: Date; endDate: Date }) => void;
    onMoveEvent?: (args: { eventId: string; startDate: Date; endDate: Date }) => void;
  
    // Layers (optional; if omitted we create one default layer internally)
    layers?: Layer[];
    selectedLayerId?: string;
    onSelectLayer?: (layerId: string) => void;
    onAddLayer?: (label: string) => void;
    onRenameLayer?: (layerId: string, label: string) => void;
  };