<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  <h1>🚀 CPU Process Scheduling Visualizer</h1>
  <p><strong>A highly interactive, beautifully designed visualization tool for Operating System scheduling algorithms.</strong></p>
  <a href="https://omcodesk.github.io/CPU-Scheduling-Algorithm-Visualizer/"><strong>View Live Demo »</strong></a>
</div>

<br />

## 🌟 About The Project

Operating Systems rely heavily on CPU Scheduling algorithms to ensure optimal performance and fair distribution of resources among processes. **CPU Process Scheduling Visualizer** brings these abstract mathematical concepts to life! 

With a futuristic, dark-mode UI, you can manually input processes, choose your scheduling algorithm, and instantly generate **Gantt Charts** and **Performance Metrics** (Waiting Time, Turnaround Time, Completion Time).

### ✨ Key Features
- 🎨 **Stunning UI/UX**: Custom-designed dark mode with glowing animated grid backgrounds.
- 📊 **Dynamic Gantt Charts**: Watch how processes are sliced and executed over time.
- ⚡ **Lightning Fast Engine**: Client-side JavaScript ensures instant calculations with zero server lag.
- 📐 **Accurate Metrics**: Automatically calculates critical OS data metrics like average waiting and turnaround times.

---

## 🧠 Supported Algorithms

| Algorithm | Type | Description |
| :--- | :--- | :--- |
| **FCFS** *(First Come First Serve)* | Non-Preemptive | The simplest algorithm. Processes are executed exactly in the order they arrive in the ready queue. |
| **SJF** *(Shortest Job First)* | Non-Preemptive | The CPU is assigned to the process with the smallest execution (burst) time to minimize average waiting time. |
| **Priority** | Non-Preemptive | Processes are scheduled based on an assigned priority number (lower number = higher priority). |
| **Round Robin** | Preemptive | Processes execute in a cyclic order for a fixed time slice (quantum) to ensure fairness and prevent starvation. |

---

## 🚀 How to Use

1. **Visit the Live Site**: [Open the Simulator](https://omcodesk.github.io/CPU-Scheduling-Algorithm-Visualizer/)
2. **Input Processes**: Enter your Process IDs, Arrival Times, and Burst Times. (Add Priorities if using Priority Scheduling).
3. **Select Algorithm**: Pick your desired scheduling algorithm from the dropdown. If you choose *Round Robin*, don't forget to enter a **Time Quantum**.
4. **Execute**: Click **Run** to generate the Process Results table and visualize the timeline on the Gantt chart!

---

## 💻 Local Installation

If you'd like to run this locally or contribute to the project:

```bash
# Clone the repository
git clone https://github.com/Omcodesk/CPU-Scheduling-Algorithm-Visualizer.git

# Navigate into the directory
cd CPU-Scheduling-Algorithm-Visualizer

# Open index.html in your default browser
```

---

<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/Omcodesk">Omcodesk</a></i>
</div>
