import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
// import { ScheduleGrid } from "./ScheduleGrid"; // Assuming ScheduleGrid from previous context
import { testTeamGroups, testEvents, testAvailabilities } from "./components/ScheduleGrid/TestData";
import { addDays } from "date-fns";
import { ScheduleGrid } from "./components/ScheduleGrid/ScheduleGrid";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import TaskGrid from "./components/TaskGrid";

// Placeholder components for each view
const DashboardScreen = () => (
  <View style={styles.content}>
    <Text style={styles.title}>Dashboard</Text>
    <Text>Welcome to the CRM Dashboard</Text>
  </View>
);

const CalendarScreen = () => (
  <View style={styles.content}>
    <ScheduleGrid
      startDate={new Date()}
      endDate={addDays(new Date(), 6)}
      teamGroups={testTeamGroups}
      events={testEvents}
      availabilities={testAvailabilities}
      onCellClick={(data, day) => console.log("Clicked:", data, day)}
    />
  </View>
);

const KanbanScreen = () => (
  <View style={styles.content}>
    <Text style={styles.title}>Kanban</Text>
    <Text>Kanban board view coming soon</Text>
  </View>
);

const TaskGridScreen = () => (
  <View style={styles.content}>
    <TaskGrid />
  </View>
);

const OptionsScreen = () => (
  <View style={styles.content}>
    <Text style={styles.title}>Options</Text>
    <Text>Settings and configuration options</Text>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const menuItems = [
    { name: "Dashboard", icon: "home" },
    { name: "Calendar", icon: "calendar" },
    { name: "Kanban", icon: "trello" },
    { name: "Tasks", icon: "grid" },
    { name: "Options", icon: "settings" },
  ];

  return (
    <View style={styles.drawer}>
      <Text style={styles.drawerTitle}>CRM Menu</Text>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.drawerItem}
          onPress={() => navigation.navigate(item.name)}
        >
          <Feather name={item.icon} size={24} color="#fff" />
          <Text style={styles.drawerText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Navigation Setup
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            width: isMobile ? "70%" : 240,
            backgroundColor: "#2c3e50",
          },
          drawerPosition: "left",
          headerShown: !isMobile,
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "CRM Dashboard" }}
        />
        <Drawer.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: "Calendar View" }}
        />
        <Drawer.Screen
          name="Kanban"
          component={KanbanScreen}
          options={{ title: "Kanban Board" }}
        />
        <Drawer.Screen 
          name="Tasks"
          component={TaskGridScreen}
          options={{ title: "Tasks" }}
        />
        <Drawer.Screen
          name="Options"
          component={OptionsScreen}
          options={{ title: "Settings" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: "#2c3e50",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  drawerText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default App;