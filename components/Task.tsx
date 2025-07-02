import React from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { TableCell, TableRow } from "@mui/material";

export interface TaskProps {
    id: string;
    title: string;
    assignedTo?: string;
    startDate?: Dayjs | null;
    dueDate?: Dayjs | null;
    linkedTo?: string;
    onChange?: (id: string, changes: Partial<TaskProps>) => void;
}

export function Task({
    id,
    title,
    assignedTo,
    startDate,
    dueDate,
    linkedTo,
    onChange,
}: TaskProps) {
    return (
        <TableRow>
            <TableCell>
                <TextField
                    label="Task #"
                    variant="outlined"
                    size="small"
                    style={{ width: 90 }}
                    value={id}
                    disabled
                />
            </TableCell>
            <TableCell>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => onChange?.(id, { title: e.target.value })}
                    variant="outlined"
                    size="small"
                    style={{ flex: 1 }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    label="Assigned To"
                    value={assignedTo || ""}
                    onChange={(e) => onChange?.(id, { assignedTo: e.target.value })}
                    variant="outlined"
                    size="small"
                    style={{ width: 140 }}
                />
            </TableCell>
            <TableCell>
                <DatePicker
                    label="Start Date"
                    value={startDate || null}
                    onChange={(date) => onChange?.(id, { startDate: date })}
                    slotProps={{ textField: { size: "small", style: { width: 130 } } }}
                />
            </TableCell>
            <TableCell>
                <DatePicker
                    label="Due Date"
                    value={dueDate || null}
                    onChange={(date) => onChange?.(id, { dueDate: date })}
                    slotProps={{ textField: { size: "small", style: { width: 130 } } }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    label="Linked To #"
                    value={linkedTo || ""}
                    onChange={(e) => onChange?.(id, { linkedTo: e.target.value })}
                    variant="outlined"
                    size="small"
                    style={{ width: 90 }}
                />
            </TableCell>
        </TableRow>
    );
}

export default Task;
