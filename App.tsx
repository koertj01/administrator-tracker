import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Task from './components/Task';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TaskGrid from './components/TaskGrid';
import { Button } from '@mui/material';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <View style={styles.container}>

        <TaskGrid />
        <StatusBar style="auto" />
        <Button
          title="Add Task" 
          sx={{ marginTop: 2, backgroundColor: '#1976d2', color: '#fff' }}
          onClick={() => {
            console.log('Add Task button clicked');
          }}
        >
          Add Task 
        </Button>  
      </View>
    </LocalizationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
