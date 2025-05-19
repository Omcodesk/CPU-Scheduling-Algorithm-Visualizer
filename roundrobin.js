// Scheduling Simulator JavaScript (Supports FCFS, SJF, Priority, Round Robin)

const processes = [];

const form = document.getElementById('process-form');
const processTableBody = document.querySelector('#process-table tbody');
const algorithmSelect = document.getElementById('algorithm-select');
const quantumInputWrapper = document.getElementById('quantum-wrapper');
const quantumInput = document.getElementById('quantum');
const runButton = document.getElementById('run-btn');
const resultTableBody = document.querySelector('#result-table tbody');
const ganttChart = document.getElementById('gantt-chart');
const resetButton = document.getElementById('reset-btn');

// Show/hide quantum input for Round Robin
algorithmSelect.addEventListener('change', () => {
  if (algorithmSelect.value === 'roundRobin') {
    quantumInput.style.display = 'inline-block';
  } else {
    quantumInput.style.display = 'none';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('process-id').value.trim();
  const arrivalTime = parseInt(document.getElementById('arrival-time').value, 10);
  const burstTime = parseInt(document.getElementById('burst-time').value, 10);
  const priorityValue = document.getElementById('priority').value;
  const priority = priorityValue ? parseInt(priorityValue, 10) : null;

  if (!id || isNaN(arrivalTime) || isNaN(burstTime)) {
    alert('Fill in all required fields.');
    return;
  }

  if (processes.find(p => p.id === id)) {
    alert('Process ID must be unique.');
    return;
  }

  processes.push({ id, arrivalTime, burstTime, priority });
  updateProcessTable();
  form.reset();
  document.getElementById('arrival-time').value = 0;
  document.getElementById('burst-time').value = 1;
});

function updateProcessTable() {
  processTableBody.innerHTML = '';
  processes.forEach(({ id, arrivalTime, burstTime, priority }) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${id}</td>
      <td>${arrivalTime}</td>
      <td>${burstTime}</td>
      <td>${priority !== null ? priority : '-'}</td>
    `;
    processTableBody.appendChild(row);
  });
}

runButton.addEventListener('click', () => {
  const algo = algorithmSelect.value;
  const quantum = parseInt(quantumInput.value, 10);
  if (processes.length === 0) {
    alert('Add at least one process.');
    return;
  }
  switch (algo) {
    case 'fcfs':
      runFCFS(); break;
    case 'sjf':
      runSJF(); break;
    case 'priority':
      runPriority(); break;
    case 'roundRobin':
      if (!quantum || isNaN(quantum) || quantum <= 0) {
        alert('Enter a valid quantum time for Round Robin.');
        return;
      }
      runRoundRobin(quantum); break;
    default:
      alert('Algorithm not implemented.');
  }
});

resetButton.addEventListener('click', () => {
  processes.length = 0;
  updateProcessTable();
  resultTableBody.innerHTML = '';
  ganttChart.innerHTML = '';
});

function showResults(results) {
  resultTableBody.innerHTML = '';
  ganttChart.innerHTML = '';

  results.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.arrivalTime}</td>
      <td>${p.burstTime}</td>
      <td>${p.completionTime}</td>
      <td>${p.waitingTime}</td>
      <td>${p.turnaroundTime}</td>
    `;
    resultTableBody.appendChild(row);

    const block = document.createElement('div');
    block.style.display = 'inline-block';
    block.style.padding = '5px 10px';
    block.style.margin = '2px';
    block.style.backgroundColor = '#007bff';
    block.style.color = '#fff';
    block.style.borderRadius = '4px';
    block.textContent = `${p.id} (${p.startTime}-${p.completionTime})`;
    ganttChart.appendChild(block);
  });
}

function runFCFS() {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  const results = [];
  sorted.forEach(p => {
    if (time < p.arrivalTime) time = p.arrivalTime;
    const startTime = time;
    const completionTime = time + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;

    results.push({ ...p, startTime, completionTime, turnaroundTime, waitingTime });
    time = completionTime;
  });
  showResults(results);
}

function runSJF() {
  const ready = [...processes];
  let time = 0;
  const results = [];

  while (ready.length > 0) {
    const available = ready.filter(p => p.arrivalTime <= time);
    if (available.length === 0) {
      time = ready[0].arrivalTime;
      continue;
    }
    available.sort((a, b) => a.burstTime - b.burstTime);
    const current = available[0];
    const index = ready.findIndex(p => p.id === current.id);
    ready.splice(index, 1);

    const startTime = time;
    const completionTime = time + current.burstTime;
    const turnaroundTime = completionTime - current.arrivalTime;
    const waitingTime = turnaroundTime - current.burstTime;

    results.push({ ...current, startTime, completionTime, turnaroundTime, waitingTime });
    time = completionTime;
  }
  showResults(results);
}

function runPriority() {
  const ready = [...processes];
  let time = 0;
  const results = [];

  while (ready.length > 0) {
    const available = ready.filter(p => p.arrivalTime <= time);
    if (available.length === 0) {
      time = ready[0].arrivalTime;
      continue;
    }
    available.sort((a, b) => a.priority - b.priority);
    const current = available[0];
    const index = ready.findIndex(p => p.id === current.id);
    ready.splice(index, 1);

    const startTime = time;
    const completionTime = time + current.burstTime;
    const turnaroundTime = completionTime - current.arrivalTime;
    const waitingTime = turnaroundTime - current.burstTime;

    results.push({ ...current, startTime, completionTime, turnaroundTime, waitingTime });
    time = completionTime;
  }
  showResults(results);
}

function runRoundRobin(quantum) {
  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const results = [];
  let time = 0;
  const ganttData = [];
  const remaining = new Map();
  queue.forEach(p => remaining.set(p.id, p.burstTime));

  const readyQueue = [];
  let i = 0;

  while (queue.length > 0 || readyQueue.length > 0) {
    while (i < queue.length && queue[i].arrivalTime <= time) {
      readyQueue.push(queue[i]);
      i++;
    }

    if (readyQueue.length === 0) {
      time = queue[i].arrivalTime;
      continue;
    }

    const current = readyQueue.shift();
    const execTime = Math.min(quantum, remaining.get(current.id));
    const startTime = time;
    time += execTime;
    const remainingTime = remaining.get(current.id) - execTime;
    remaining.set(current.id, remainingTime);

    ganttData.push({ id: current.id, startTime, endTime: time });

    if (remainingTime > 0) {
      while (i < queue.length && queue[i].arrivalTime <= time) {
        readyQueue.push(queue[i]);
        i++;
      }
      readyQueue.push(current);
    } else {
      const completionTime = time;
      const turnaroundTime = completionTime - current.arrivalTime;
      const waitingTime = turnaroundTime - current.burstTime;
      results.push({ ...current, startTime, completionTime, turnaroundTime, waitingTime });
    }
  }
  showResultsWithGantt(results, ganttData);
}

function showResultsWithGantt(results, ganttData) {
  resultTableBody.innerHTML = '';
  ganttChart.innerHTML = '';

  results.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.arrivalTime}</td>
      <td>${p.burstTime}</td>
      <td>${p.completionTime}</td>
      <td>${p.waitingTime}</td>
      <td>${p.turnaroundTime}</td>
    `;
    resultTableBody.appendChild(row);
  });

  ganttData.forEach(block => {
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '5px 10px';
    div.style.margin = '2px';
    div.style.backgroundColor = '#007bff';
    div.style.color = '#fff';
    div.style.borderRadius = '4px';
    div.textContent = `${block.id} (${block.startTime}-${block.endTime})`;
    ganttChart.appendChild(div);
  });
}