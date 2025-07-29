import React from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import dayjs from 'dayjs'
import Task from './Task'

// We need some test data for our task grid
const tasks = [
  { id: '1', title: 'Task One', assignedTo: 'Alice', dueDate: '2025-01-01', status: 'Open' },
  { id: '2', title: 'Task Two', assignedTo: 'Bob', dueDate: '2025-02-01', status: 'In Progress' },
  { id: '3', title: 'Task Three', assignedTo: 'Charlie', dueDate: '2025-03-01', status: 'Completed' },
]

function TaskGrid() {
  return (
    <Box sx={{ overflow: "auto" }}>
        <Table sx={{ minWidth: 700, backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Task #</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Linked To...</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {tasks.map((task, idx) => (
              <Task
                key={task.id ?? idx}
                id={task.id}
                title={task.title}
                assignedTo={task.assignedTo}
                dueDate={dayjs(task.dueDate)}
                // TODO we need more properties for Task, since we want to eventually convert to a KANBAN board 
                // status={task.status}
                // index={idx}
              />
            ))}
            </TableBody>
        </Table>
    </Box>
  )
}

export default TaskGrid