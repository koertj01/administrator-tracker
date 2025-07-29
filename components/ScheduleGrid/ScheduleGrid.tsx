// ScheduleGrid.tsx

import { useState } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { ScheduleGridProps, ScheduleEvent, Availability } from "./ScheduleGrid.types";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import Grid from "@mui/material/Grid";

export const ScheduleGrid = ({ startDate, endDate, teamGroups, onCellClick, events = [], availabilities = [] }: ScheduleGridProps) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const [dragStart, setDragStart] = useState<{ memberId: string; day: Date } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ memberId: string; day: Date }[]>([]);

  // Helper to check if a cell is part of a dragged selection
  const isCellSelected = (memberId: string, day: Date) =>
    selectedCells.some((cell) => cell.memberId === memberId && isSameDay(cell.day, day));

  // Helper to get events for a specific member and day
  const getCellEvents = (memberId: string, day: Date) =>
    events.filter(
      (event) =>
        event.memberId === memberId &&
        isSameDay(event.date, day)
    );

  // Helper to get availability for a specific member and day
  const getCellAvailability = (memberId: string, day: Date) =>
    availabilities.find(
      (avail) => avail.memberId === memberId && isSameDay(avail.date, day)
    );

  // Handle drag start
  const handleDragStart = (member: { id: string }, day: Date) => {
    setDragStart({ memberId: member.id, day });
    setSelectedCells([{ memberId: member.id, day }]);
  };

  // Handle drag over
  const handleDragOver = (member: { id: string }, day: Date) => {
    if (!dragStart) return;

    // Only update if dragging within the same member row
    if (dragStart.memberId === member.id) {
      const startDay = dragStart.day;
      const newSelection = eachDayOfInterval({
        start: startDay < day ? startDay : day,
        end: startDay < day ? day : startDay,
      }).map((d) => ({ memberId: member.id, day: d }));
      setSelectedCells(newSelection);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (dragStart && selectedCells.length > 0) {
      onCellClick?.(selectedCells);
    }
    setDragStart(null);
    setSelectedCells([]);
  };

  return (
    <Box sx={{ overflow: "auto" }} onMouseUp={handleDragEnd}>
      <Grid container direction="column">
        {/* Date Header Row */}
        <Grid container wrap="nowrap">
          <Grid sx={{ minWidth: 200 }} />
          {days.map((day, i) => (
            <Grid key={i} sx={{ minWidth: 100, textAlign: "center" }}>
              <Typography variant="body2">{format(day, "d MMM")}</Typography>
              <Typography variant="caption">{format(day, "EEE")}</Typography>
            </Grid>
          ))}
        </Grid>

        {/* Team Rows */}
        {teamGroups.map((group, gi) => (
          <Grid key={gi} direction="column" container sx={{ borderTop: "1px solid #ccc", mt: 2 }}>
            <Grid>
              <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
            </Grid>

            {group.members.map((member, mi) => (
              <Grid key={mi} container wrap="nowrap">
                <Grid sx={{ minWidth: 200 }}>
                  <Box p={1}>
                    <Typography>{member.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Grid>

                {days.map((day, di) => {
                  const cellEvents = getCellEvents(member.id, day);
                  const availability = getCellAvailability(member.id, day);
                  const isSelected = isCellSelected(member.id, day);

                  return (
                    <Grid
                      key={di}
                      sx={{
                        minWidth: 100,
                        height: 40,
                        border: "1px solid #eee",
                        backgroundColor: isSelected
                          ? "#e3f2fd"
                          : availability?.status === "available"
                          ? "#e8f5e9"
                          : availability?.status === "unavailable"
                          ? "#ffebee"
                          : "#fff",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onMouseDown={() => handleDragStart(member, day)}
                      onMouseOver={() => handleDragOver(member, day)}
                      onClick={() => !dragStart && onCellClick?.(member, day)}
                    >
                      {cellEvents.map((event, ei) => (
                        <Tooltip key={ei} title={event.title}>
                          <Box
                            sx={{
                              backgroundColor: event.color || "#2196f3",
                              color: "#fff",
                              fontSize: "0.75rem",
                              padding: "2px 4px",
                              borderRadius: 1,
                              position: "absolute",
                              top: 2,
                              left: 2,
                              right: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {event.title}
                          </Box>
                        </Tooltip>
                      ))}
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};