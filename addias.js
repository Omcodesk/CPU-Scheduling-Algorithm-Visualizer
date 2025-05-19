// JavaScript for Process Scheduling Simulator

const processForm = document.getElementById("process-form");
const processTableBody = document.querySelector("#process-table tbody");
const algorithmSelect = document.getElementById("algorithm-select");
const quantumInput = document.getElementById("quantum");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const ganttChart = document.getElementById("gantt-chart");
const resultsTableBody = document.querySelector("#results-table tbody");

let processes = [];

algorithmSelect.addEventListener("change", () => {
  quantumInput.style.display = algorithmSelect.value === "roundRobin" ? "inline-block" : "none";
});

processForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("process-id").value;
  const arrival = parseInt(document.getElementById("arrival-time").value);
  const burst = parseInt(document.getElementById("burst-time").value);
  const priority = document.getElementById("priority").value ? parseInt(document.getElementById("priority").value) : null;

  processes.push({ id, arrival, burst, priority, remaining: burst });
  addProcessToTable({ id, arrival, burst, priority });
  processForm.reset();
});

function addProcessToTable(p) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${p.id}</td>
    <td>${p.arrival}</td>
    <td>${p.burst}</td>
    <td>${p.priority ?? '-'}</td>
  `;
  processTableBody.appendChild(row);
}

runBtn.addEventListener("click", () => {
  if (!processes.length) return;
  const algo = algorithmSelect.value;
  const quantum = parseInt(quantumInput.value);
  ganttChart.innerHTML = "";
  resultsTableBody.innerHTML = "";

  let result = [];
  if (algo === "fcfs") result = fcfs([...processes]);
  else if (algo === "sjfNonPreemptive") result = sjf([...processes]);
  else if (algo === "priorityNonPreemptive") result = priorityScheduling([...processes]);
  else if (algo === "roundRobin") result = roundRobin([...processes], quantum);

  displayResults(result);
});

resetBtn.addEventListener("click", () => {
  processes = [];
  processTableBody.innerHTML = "";
  ganttChart.innerHTML = "";
  resultsTableBody.innerHTML = "";
});

function displayResults(result) {
  result.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.arrival}</td>
      <td>${p.burst}</td>
      <td>${p.completion}</td>
      <td>${p.waiting}</td>
      <td>${p.turnaround}</td>
    `;
    resultsTableBody.appendChild(row);

    const bar = document.createElement("div");
    bar.className = "gantt-bar";
    bar.style.width = `${(p.turnaround || 1) * 30}px`;
    bar.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    bar.innerText = p.id;
    ganttChart.appendChild(bar);
  });
}

function fcfs(queue) {
  queue.sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  return queue.map(p => {
    time = Math.max(time, p.arrival);
    const start = time;
    time += p.burst;
    return {
      ...p,
      completion: time,
      turnaround: time - p.arrival,
      waiting: start - p.arrival,
    };
  });
}

function sjf(queue) {
  let time = 0;
  let result = [];
  while (queue.length) {
    const ready = queue.filter(p => p.arrival <= time);
    if (!ready.length) {
      time++;
      continue;
    }
    ready.sort((a, b) => a.burst - b.burst);
    const next = ready[0];
    queue.splice(queue.indexOf(next), 1);
    const start = time;
    time += next.burst;
    result.push({
      ...next,
      completion: time,
      turnaround: time - next.arrival,
      waiting: start - next.arrival,
    });
  }
  return result;
}

function priorityScheduling(queue) {
  let time = 0;
  let result = [];
  while (queue.length) {
    const ready = queue.filter(p => p.arrival <= time);
    if (!ready.length) {
      time++;
      continue;
    }
    ready.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
    const next = ready[0];
    queue.splice(queue.indexOf(next), 1);
    const start = time;
    time += next.burst;
    result.push({
      ...next,
      completion: time,
      turnaround: time - next.arrival,
      waiting: start - next.arrival,
    });
  }
  return result;
}

function roundRobin(queue, quantum) {
  let time = 0, result = [];
  const q = [];
  queue.sort((a, b) => a.arrival - b.arrival);
  let index = 0;
  while (queue.length || q.length) {
    while (index < queue.length && queue[index].arrival <= time) {
      q.push(queue[index]);
      index++;
    }
    if (!q.length) {
      time++;
      continue;
    }
    const current = q.shift();
    const slice = Math.min(current.remaining, quantum);
    time += slice;
    current.remaining -= slice;
    while (index < queue.length && queue[index].arrival <= time) {
      q.push(queue[index]);
      index++;
    }
    if (current.remaining > 0) {
      q.push(current);
    } else {
      result.push({
        ...current,
        completion: time,
        turnaround: time - current.arrival,
        waiting: time - current.arrival - current.burst,
      });
    }
  }
  return result;
}
