
// ScheduleGrid.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Chip,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ScheduleGridProps,
  ScheduleEvent,
  Availability,
  Layer,
} from "./ScheduleGrid.types";
import {
  format,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  max,
  min,
} from "date-fns";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const CELL_WIDTH = 100; // Width of each cell in pixels
const CELL_HEIGHT = 40;
const CELL_BORDER = 1;

const clampDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const dayToIndex = (days: Date[], d: Date) =>
  days.findIndex((x) => isSameDay(x, d));

const dateFromIndex = (days: Date[], idx: number) =>
  days[Math.max(0, Math.min(days.length - 1, idx))];

const normalizeEvents = (events: ScheduleEvent[] = []): ScheduleEvent[] =>
  events.map((e) =>
    e.date
      ? {
          ...e,
          startDate: e.startDate ?? e.date,
          endDate: e.endDate ?? e.date,
          layerId: e.layerId ?? "default",
        }
      : { ...e, layerId: e.layerId ?? "default" }
  );

type ResizeState = null | {
  eventId: string;
  edge: "start" | "end" | "move";
  memberId: string;
  layerId: string;
  anchorStartIdx: number;
  anchorEndIdx: number;
  grabOffset?: number; // for moving
};

export const ScheduleGrid = ({
  startDate,
  endDate,
  teamGroups,
  onCellClick,
  events = [],
  availabilities = [],
  onCreateEvent,
  onResizeEvent,
  onMoveEvent,
  layers: layersProp,
  selectedLayerId: selectedLayerIdProp,
  onSelectLayer,
  onAddLayer,
  onRenameLayer,
}: ScheduleGridProps) => {
  // ----- Dates -----
  const days = useMemo(
    () => eachDayOfInterval({ start: startDate, end: endDate }).map(clampDate),
    [startDate, endDate]
  );

  // ----- Events (controlled-or-uncontrolled) -----
  const [internalEvents, setInternalEvents] = useState<ScheduleEvent[]>(
    normalizeEvents(events)
  );
  useEffect(() => {
    setInternalEvents(normalizeEvents(events));
  }, [events]);

  const displayedEvents = internalEvents;

  // ----- Layers -----
  const [layers, setLayers] = useState<Layer[]>(
    layersProp && layersProp.length
      ? layersProp
      : [{ id: "default", label: "Default View" }]
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    selectedLayerIdProp ?? layers[0].id
  );
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  useEffect(() => {
    if (!layersProp) return;
    // Mirror layers when parent controls them
    setLayers(layersProp);
    const effectiveSelected = selectedLayerIdProp ?? selectedLayerId;
    if (!layersProp.find((l) => l.id === effectiveSelected)) {
      setSelectedLayerId(layersProp[0]?.id ?? "default");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersProp]);

  const effectiveLayers = layersProp ?? layers;
  const activeLayerId = selectedLayerIdProp ?? selectedLayerId;

  const handleSelectLayer = (id: string) => {
    onSelectLayer ? onSelectLayer(id) : setSelectedLayerId(id);
  };

  const handleAddLayer = () => {
    const label = `View ${effectiveLayers.length + 1}`;
    const id = `${Date.now()}`;
    if (onAddLayer) onAddLayer(label);
    else setLayers((prev) => [...prev, { id, label }]);
    onSelectLayer ? onSelectLayer(id) : setSelectedLayerId(id);
  };

  const beginRename = (layer: Layer) => {
    setRenamingLayerId(layer.id);
    setRenameText(layer.label);
  };

  const commitRename = () => {
    if (!renamingLayerId) return;
    if (onRenameLayer)
      onRenameLayer(renamingLayerId, renameText.trim() || "Untitled");
    else
      setLayers((prev) =>
        prev.map((l) =>
          l.id === renamingLayerId
            ? { ...l, label: renameText.trim() || "Untitled" }
            : l
        )
      );
    setRenamingLayerId(null);
    setRenameText("");
  };

  // ----- Selection (create new span) -----
  const [dragStart, setDragStart] = useState<{
    memberId: string;
    dayIdx: number;
  } | null>(null);
  const [selectedCells, setSelectedCells] = useState<
    { memberId: string; day: Date }[]
  >([]);

  const isCellSelected = (memberId: string, day: Date) =>
    selectedCells.some(
      (cell) => cell.memberId === memberId && isSameDay(cell.day, day)
    );

  const handleDragStartCell = (member: { id: string }, day: Date) => {
    const dayIdx = dayToIndex(days, day);
    setDragStart({ memberId: member.id, dayIdx });
    setSelectedCells([{ memberId: member.id, day }]);
  };

  const handleDragOverCell = (member: { id: string }, day: Date) => {
    if (!dragStart) return;
    if (dragStart.memberId !== member.id) return;
    const endIdx = dayToIndex(days, day);
    const [startIdx, lastIdx] =
      dragStart.dayIdx <= endIdx
        ? [dragStart.dayIdx, endIdx]
        : [endIdx, dragStart.dayIdx];
    const range = days
      .slice(startIdx, lastIdx + 1)
      .map((d) => ({ memberId: member.id, day: d }));
    setSelectedCells(range);
  };

  // ----- Resize/Move existing spans -----
  const [resizeState, setResizeState] = useState<ResizeState>(null);
  const [pendingRange, setPendingRange] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const startResize = (evt: ScheduleEvent, edge: "start" | "end") => {
    const anchorStartIdx = dayToIndex(days, max([evt.startDate, days[0]]));
    const anchorEndIdx = dayToIndex(
      days,
      min([evt.endDate, days[days.length - 1]])
    );
    setResizeState({
      eventId: evt.id,
      edge,
      memberId: evt.memberId,
      layerId: evt.layerId,
      anchorStartIdx: anchorStartIdx === -1 ? 0 : anchorStartIdx,
      anchorEndIdx: anchorEndIdx === -1 ? days.length - 1 : anchorEndIdx,
    });
    setPendingRange({ startDate: evt.startDate, endDate: evt.endDate });
  };

  const startMove = (evt: ScheduleEvent, clientX: number, rowLeft: number) => {
    const startIdx = dayToIndex(days, max([evt.startDate, days[0]]));
    const pxFromRow = clientX - rowLeft;
    const grabOffset = Math.max(
      0,
      Math.floor(pxFromRow / CELL_WIDTH) - startIdx
    );
    setResizeState({
      eventId: evt.id,
      edge: "move",
      memberId: evt.memberId,
      layerId: evt.layerId,
      anchorStartIdx: startIdx,
      anchorEndIdx: dayToIndex(days, min([evt.endDate, days[days.length - 1]])),
      grabOffset,
    });
    setPendingRange({ startDate: evt.startDate, endDate: evt.endDate });
  };

  const updateResizeOnHover = (member: { id: string }, day: Date) => {
    if (!resizeState) return;
    if (member.id !== resizeState.memberId) return;
    const idx = dayToIndex(days, day);
    const current = displayedEvents.find((e) => e.id === resizeState.eventId);
    if (!current) return;

    let startDate = current.startDate;
    let endDate = current.endDate;

    if (resizeState.edge === "start") {
      const newStartIdx = Math.min(idx, dayToIndex(days, current.endDate));
      startDate = dateFromIndex(days, Math.max(0, newStartIdx));
    } else if (resizeState.edge === "end") {
      const newEndIdx = Math.max(idx, dayToIndex(days, current.startDate));
      endDate = dateFromIndex(days, Math.min(days.length - 1, newEndIdx));
    } else if (resizeState.edge === "move") {
      const spanLen =
        dayToIndex(days, min([current.endDate, days[days.length - 1]])) -
        dayToIndex(days, max([current.startDate, days[0]]));
      const startIdx = Math.max(
        0,
        Math.min(idx - (resizeState.grabOffset ?? 0), days.length - 1 - spanLen)
      );
      const endIdx = startIdx + spanLen;
      startDate = dateFromIndex(days, startIdx);
      endDate = dateFromIndex(days, endIdx);
    }

    setPendingRange({ startDate, endDate });
  };

  // ----- Finalize on mouseup (global) -----
  const handleMouseUpGlobal = useCallback(() => {
    // finalize create
    if (dragStart && selectedCells.length > 0) {
      const start = selectedCells[0].day;
      const end = selectedCells[selectedCells.length - 1].day;
      if (onCreateEvent) {
        onCreateEvent({
          memberId: dragStart.memberId,
          layerId: activeLayerId,
          startDate: start,
          endDate: end,
        });
      } else {
        setInternalEvents((prev) => [
          ...prev,
          {
            id: `tmp-${Date.now()}`,
            memberId: dragStart.memberId,
            title: "New item",
            layerId: activeLayerId,
            startDate: start,
            endDate: end,
            color: "#1976d2",
          },
        ]);
      }
    }

    // finalize resize/move
    if (resizeState && pendingRange) {
      const { eventId } = resizeState;
      const { startDate, endDate } = pendingRange;

      if (resizeState.edge === "move") {
        if (onMoveEvent) onMoveEvent({ eventId, startDate, endDate });
        else
          setInternalEvents((prev) =>
            prev.map((e) =>
              e.id === eventId ? { ...e, startDate, endDate } : e
            )
          );
      } else {
        if (onResizeEvent) onResizeEvent({ eventId, startDate, endDate });
        else
          setInternalEvents((prev) =>
            prev.map((e) =>
              e.id === eventId ? { ...e, startDate, endDate } : e
            )
          );
      }
    }

    setDragStart(null);
    setSelectedCells([]);
    setResizeState(null);
    setPendingRange(null);
  }, [
    dragStart,
    selectedCells,
    resizeState,
    pendingRange,
    activeLayerId,
    onCreateEvent,
    onMoveEvent,
    onResizeEvent,
  ]);

  useEffect(() => {
    const onUp = () => handleMouseUpGlobal();
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [handleMouseUpGlobal]);

  // ----- Availability helpers -----
  const getCellAvailability = (memberId: string, day: Date) =>
    availabilities.find(
      (a) => a.memberId === memberId && isSameDay(a.date, day)
    );

  const getCellEventsSingleDay = (memberId: string, day: Date) =>
    displayedEvents.filter(
      (e) =>
        e.memberId === memberId &&
        isSameDay(e.startDate, day) &&
        isSameDay(e.endDate, day) &&
        e.layerId === activeLayerId
    );

  const getMemberLayerEventsInWindow = (memberId: string) =>
    displayedEvents.filter(
      (e) =>
        e.memberId === memberId &&
        e.layerId === activeLayerId &&
        !(
          isBefore(e.endDate, days[0]) ||
          isAfter(e.startDate, days[days.length - 1])
        )
    );

  // ----- Row overlay refs for move calc -----
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ----- Render -----
  return (
    <Box sx={{ overflow: "auto" }}>
      {/* Layers header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {effectiveLayers.map((layer) =>
          renamingLayerId === layer.id ? (
            <Stack
              key={layer.id}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                size="small"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => e.key === "Enter" && commitRename()}
                autoFocus
              />
            </Stack>
          ) : (
            <Chip
              key={layer.id}
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <span>{layer.label}</span>
                  <DriveFileRenameOutlineIcon
                    fontSize="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      beginRename(layer);
                    }}
                  />
                </Stack>
              }
              color={activeLayerId === layer.id ? "primary" : "default"}
              onClick={() => handleSelectLayer(layer.id)}
              sx={{ cursor: "pointer" }}
            />
          )
        )}
        <IconButton size="small" onClick={handleAddLayer}>
          <AddIcon />
        </IconButton>
      </Stack>

      <Grid container direction="column">
        {/* Date Header Row */}
        <Grid container wrap="nowrap">
          <Grid sx={{ minWidth: 200 }} />
          {days.map((day, i) => (
            <Grid key={i} sx={{ minWidth: CELL_WIDTH, textAlign: "center" }}>
              <Typography variant="body2">{format(day, "d MMM")}</Typography>
              <Typography variant="caption">{format(day, "EEE")}</Typography>
            </Grid>
          ))}
        </Grid>

        {/* Team Rows */}
        {teamGroups.map((group, gi) => (
          <Grid
            key={gi}
            direction="column"
            container
            sx={{ borderTop: "1px solid #ccc", mt: 2 }}
          >
            <Grid>
              <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
            </Grid>

            {group.members.map((member, mi) => {
              // events for this member (current layer) that touch the window
              const memberEvents = getMemberLayerEventsInWindow(member.id);

              return (
                <Grid
                  key={mi}
                  container
                  wrap="nowrap"
                  sx={{ position: "relative" }}
                >
                  {/* Row label */}
                  <Grid sx={{ minWidth: 200 }}>
                    <Box p={1}>
                      <Typography>{member.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Days row */}
                  <Grid
                    item
                    sx={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: `repeat(${days.length}, ${CELL_WIDTH}px)`,
                    }}
                    ref={(el) => (rowRefs.current[member.id] = el)}
                  >
                    {/* Cells */}
                    {days.map((day, di) => {
                      const availability = getCellAvailability(member.id, day);
                      const isSelected = isCellSelected(member.id, day);
                      const singleDayEvents = getCellEventsSingleDay(
                        member.id,
                        day
                      );

                      return (
                        <Box
                          key={di}
                          sx={{
                            width: CELL_WIDTH,
                            height: CELL_HEIGHT,
                            border: `${CELL_BORDER}px solid #eee`,
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
                            userSelect: "none",
                          }}
                          onMouseDown={() => handleDragStartCell(member, day)}
                          onMouseMove={() => {
                            handleDragOverCell(member, day);
                            updateResizeOnHover(member, day);
                          }}
                          onClick={() =>
                            !dragStart && onCellClick?.(member, day)
                          }
                        >
                          {/* legacy single-day chips still show */}
                          {singleDayEvents.map((event, ei) => (
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
                        </Box>
                      );
                    })}

                    {/* Spanning event overlays */}
                    {memberEvents.map((evt) => {
                      // visible intersection within window
                      const visStart = max([evt.startDate, days[0]]);
                      const visEnd = min([evt.endDate, days[days.length - 1]]);
                      const startIdx = dayToIndex(days, visStart);
                      const endIdx = dayToIndex(days, visEnd);
                      if (startIdx === -1 || endIdx === -1) return null;

                      // apply pending preview while resizing/moving
                      const isActive = resizeState?.eventId === evt.id;
                      const preview =
                        isActive && pendingRange
                          ? pendingRange
                          : { startDate: visStart, endDate: visEnd };
                      const previewStartIdx = dayToIndex(
                        days,
                        max([preview.startDate, days[0]])
                      );
                      const previewEndIdx = dayToIndex(
                        days,
                        min([preview.endDate, days[days.length - 1]])
                      );

                      const left = previewStartIdx * CELL_WIDTH;
                      const width =
                        (previewEndIdx - previewStartIdx + 1) * CELL_WIDTH - 8;

                      return (
                        <Box
                          key={evt.id}
                          sx={{
                            position: "absolute",
                            top: 4,
                            left,
                            width,
                            height: CELL_HEIGHT - 8,
                            backgroundColor: evt.color || "#1976d2",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            px: 1,
                            color: "#fff",
                            boxShadow: isActive ? 4 : 1,
                            cursor: "grab",
                            zIndex: isActive ? 3 : 2,
                          }}
                          onMouseDown={(e) => {
                            const rowLeft =
                              rowRefs.current[
                                member.id
                              ]?.getBoundingClientRect().left ?? 0;
                            startMove(evt, e.clientX, rowLeft);
                            e.stopPropagation();
                          }}
                        >
                          {/* left handle */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 6,
                              cursor: "ew-resize",
                              backgroundColor: "rgba(255,255,255,0.2)",
                              borderTopLeftRadius: 4,
                              borderBottomLeftRadius: 4,
                            }}
                            onMouseDown={(e) => {
                              startResize(evt, "start");
                              e.stopPropagation();
                            }}
                          />
                          {/* title */}
                          <Typography
                            variant="caption"
                            sx={{
                              mx: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {evt.title}
                          </Typography>
                          {/* right handle */}
                          <Box
                            sx={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                              bottom: 0,
                              width: 6,
                              cursor: "ew-resize",
                              backgroundColor: "rgba(255,255,255,0.2)",
                              borderTopRightRadius: 4,
                              borderBottomRightRadius: 4,
                            }}
                            onMouseDown={(e) => {
                              startResize(evt, "end");
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

