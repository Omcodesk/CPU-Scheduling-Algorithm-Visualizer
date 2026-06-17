const processForm = document.getElementById('process-form');
const processTableBody = document.querySelector('#process-table tbody');
const resultTableBody = document.querySelector('#result-table tbody');
const ganttChart = document.getElementById('gantt-chart');
const algorithmSelect = document.getElementById('algorithm-select');
const quantumWrapper = document.getElementById('quantum-wrapper');
const quantumInput = document.getElementById('quantum');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');

let processes = [];

algorithmSelect.addEventListener('change', () => {
  quantumWrapper.style.display = algorithmSelect.value === 'roundRobin' ? 'inline' : 'none';
});

processForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('process-id').value;
  const arrival = parseInt(document.getElementById('arrival-time').value);
  const burst = parseInt(document.getElementById('burst-time').value);
  
  // Default priority to 999 (lowest priority) if not provided
  const priorityInput = document.getElementById('priority').value;
  const priority = priorityInput ? parseInt(priorityInput) : 999;

  processes.push({ id, arrival, burst, remaining: burst, priority });
  updateProcessTable();
  processForm.reset();
});

runBtn.addEventListener('click', () => {
  if (processes.length === 0) return alert("Please add at least one process!");
  
  const algorithm = algorithmSelect.value;
  let resultsObj = null;

  if (algorithm === 'fcfs') resultsObj = runFCFS([...processes]);
  else if (algorithm === 'sjf') resultsObj = runSJF([...processes]);
  else if (algorithm === 'priority') resultsObj = runPriority([...processes]);
  else if (algorithm === 'roundRobin') {
    const quantum = parseInt(quantumInput.value);
    if (!quantum || quantum <= 0) return alert('Valid Quantum time required!');
    resultsObj = runRoundRobin([...processes], quantum);
  }

  if (resultsObj) showResults(resultsObj.tableData, resultsObj.ganttData);
});

resetBtn.addEventListener('click', () => {
  processes = [];
  processTableBody.innerHTML = '';
  resultTableBody.innerHTML = '';
  ganttChart.innerHTML = '';
});

function updateProcessTable() {
  processTableBody.innerHTML = '';
  processes.forEach(p => {
    processTableBody.innerHTML += `<tr>
      <td>${p.id}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${p.priority === 999 ? '-' : p.priority}</td>
    </tr>`;
  });
}

function showResults(tableData, ganttData) {
  resultTableBody.innerHTML = '';
  ganttChart.innerHTML = '';

  tableData.forEach(r => {
    resultTableBody.innerHTML += `<tr>
      <td>${r.id}</td><td>${r.arrival}</td><td>${r.burst}</td>
      <td>${r.completion}</td><td>${r.waiting}</td><td>${r.turnaround}</td>
    </tr>`;
  });
  
  ganttData.forEach(r => {
    ganttChart.innerHTML += `<div class="gantt-block">${r.id}<br>${r.start}-${r.end}</div>`;
  });
}

function runFCFS(processes) {
  processes.sort((a, b) => a.arrival - b.arrival);
  let time = 0, result = [];

  for (const p of processes) {
    const start = Math.max(time, p.arrival);
    const end = start + p.burst;
    result.push({
      ...p,
      start,
      end,
      completion: end,
      turnaround: end - p.arrival,
      waiting: start - p.arrival
    });
    time = end;
  }
  return { tableData: result, ganttData: result };
}

function runSJF(processes) {
  let time = 0, result = [], done = [];
  while (done.length < processes.length) {
    const ready = processes.filter(p => p.arrival <= time && !done.includes(p));
    if (ready.length === 0) {
      // Fast forward time to the next arrival instead of time++ loop
      const nextArrival = Math.min(...processes.filter(p => !done.includes(p)).map(p => p.arrival));
      time = nextArrival;
      continue;
    }
    ready.sort((a, b) => a.burst - b.burst);
    const p = ready[0];
    const start = time;
    const end = time + p.burst;
    result.push({
      ...p,
      start,
      end,
      completion: end,
      turnaround: end - p.arrival,
      waiting: start - p.arrival
    });
    done.push(p);
    time = end;
  }
  return { tableData: result, ganttData: result };
}

function runPriority(processes) {
  let time = 0, result = [], done = [];
  while (done.length < processes.length) {
    const ready = processes.filter(p => p.arrival <= time && !done.includes(p));
    if (ready.length === 0) {
      const nextArrival = Math.min(...processes.filter(p => !done.includes(p)).map(p => p.arrival));
      time = nextArrival;
      continue;
    }
    // Lower number means higher priority
    ready.sort((a, b) => a.priority - b.priority);
    const p = ready[0];
    const start = time;
    const end = time + p.burst;
    result.push({
      ...p,
      start,
      end,
      completion: end,
      turnaround: end - p.arrival,
      waiting: start - p.arrival
    });
    done.push(p);
    time = end;
  }
  return { tableData: result, ganttData: result };
}

function runRoundRobin(processes, quantum) {
  let time = 0, queue = [], result = [];
  let completed = new Set();
  
  // Create a deep copy of processes to track remaining burst properly without mutating original array
  const activeProcesses = processes.map(p => ({ ...p, remaining: p.burst, inQueue: false }));

  // Helper to add arrived processes to queue
  const addArrivedToQueue = () => {
    activeProcesses.forEach(p => {
      if (p.arrival <= time && !p.inQueue && !completed.has(p.id) && p.remaining > 0) {
        queue.push(p);
        p.inQueue = true;
      }
    });
  };

  addArrivedToQueue();

  while (completed.size < activeProcesses.length) {
    if (queue.length === 0) {
      // Fast forward to next arrival
      const uncompleted = activeProcesses.filter(p => !completed.has(p.id));
      if (uncompleted.length > 0) {
         const nextArrival = Math.min(...uncompleted.map(p => p.arrival));
         time = nextArrival;
         addArrivedToQueue();
      }
      continue;
    }

    const p = queue.shift();
    p.inQueue = false;
    
    const execTime = Math.min(quantum, p.remaining);
    const start = time;
    time += execTime;
    p.remaining -= execTime;

    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      start,
      end: time
    });

    // Check for newly arrived processes during execution BEFORE pushing current process back to queue
    addArrivedToQueue();

    if (p.remaining > 0) {
      queue.push(p);
      p.inQueue = true;
    } else {
      completed.add(p.id);
    }
  }

  // Calculate completion, turnaround, waiting for final output by aggregating blocks
  let finalResults = [];
  for (const p of processes) {
    const executions = result.filter(r => r.id === p.id);
    if (executions.length > 0) {
      const completion = executions[executions.length - 1].end;
      const turnaround = completion - p.arrival;
      const waiting = turnaround - p.burst;
      finalResults.push({
        id: p.id,
        arrival: p.arrival,
        burst: p.burst,
        completion,
        turnaround,
        waiting
      });
    }
  }

  return { tableData: finalResults, ganttData: result };
}
