# Process Scheduling Simulator 🚀

A sleek, modern, and interactive Process Scheduling Simulator built with HTML, CSS, and vanilla JavaScript. This tool helps visualize how different CPU scheduling algorithms work behind the scenes in operating systems.

## ✨ Features

- **Futuristic UI**: Beautiful dark-mode design with glowing, animated grids and crisp typography.
- **Dynamic Gantt Chart**: Visualizes the execution of processes over time, including precise time-slicing for Round Robin.
- **Detailed Metrics**: Automatically calculates Completion Time, Waiting Time, and Turnaround Time for every process.
- **Responsive & Fast**: Completely client-side execution with fast-forwarding capabilities to minimize simulated idle time.

## 🧠 Supported Algorithms

1. **FCFS (First Come First Serve)**: Non-preemptive scheduling based purely on arrival time.
2. **SJF (Shortest Job First)**: Non-preemptive scheduling that prioritizes the shortest remaining burst time.
3. **Priority**: Non-preemptive scheduling that runs processes based on a user-defined priority level (lower number = higher priority).
4. **Round Robin**: Preemptive scheduling that executes processes in a cyclic order using a fixed Time Quantum.

## 💻 How to Use

1. Open `index.html` in your favorite web browser.
2. Enter your process details in the form:
   - **Process ID** (e.g., P1)
   - **Arrival Time** (e.g., 0)
   - **Burst Time** (e.g., 5)
   - **Priority** (Optional, required for Priority Scheduling)
3. Click **Add Process** to populate the queue.
4. Select your desired scheduling algorithm from the dropdown. 
   - *If Round Robin is selected, enter the Time Quantum.*
5. Click **Run** to generate the Process Results table and visualize the timeline on the Gantt chart.

## 🛠️ Built With
- **HTML5**
- **CSS3** (Keyframe animations, Flexbox, Gradients)
- **Vanilla JavaScript (ES6)**

## 📝 License
This project is open-source and available for educational purposes.
