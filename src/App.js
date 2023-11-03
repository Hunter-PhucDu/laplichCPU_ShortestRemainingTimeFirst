import React, { Component } from 'react';
import './App.css';

class CPUSchedulingSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      currentTime: 0,
      completedProcesses: [],
    };
    this.processNameInput = React.createRef();
    this.processArrivalTimeInput = React.createRef(); // Thêm trường arrivalTime
    this.processPriorityInput = React.createRef();
    this.processTimeInput = React.createRef();
    
  }

  handleRunSimulation = () => {
    const { processes, currentTime, completedProcesses } = this.state;

    if (processes.length === 0) {
      alert('Danh sách tiến trình trống!');
      return;
    }

    const availableProcesses = processes.filter(process => process.time > 0);

    if (availableProcesses.length === 0) {
      alert('Hết tiến trình');
      return;
    }

    // Sắp xếp các tiến trình theo độ ưu tiên và thời gian đến
    availableProcesses.sort((a, b) => {
      if (a.arrivalTime === b.arrivalTime) {
        return b.priority - a.priority;
      }
      return a.arrivalTime - b.arrivalTime;
    });

    const nextProcess = availableProcesses[0];
    const remainingProcesses = processes.map(process =>
      process.id === nextProcess.id ? { ...process, time: process.time - 1 } : process
    );

    this.setState({
      processes: remainingProcesses,
      currentTime: currentTime + 1,
      completedProcesses: [
        ...completedProcesses,
        { id: nextProcess.id, startTime: currentTime, endTime: currentTime + 1 },
      ],
    });

    setTimeout(this.handleRunSimulation, 100);
  };

  handleAddProcess = () => {
    const { processes } = this.state;
    const name = this.processNameInput.current.value;
    const priority = this.processPriorityInput.current.value;
    const time = this.processTimeInput.current.value;
    const arrivalTime = this.processArrivalTimeInput.current.value; // Thêm trường arrivalTime
    const id = processes.length + 1;

    if (name && priority && time && arrivalTime) {
      this.setState({
        processes: [...processes, { id, name, priority, time, arrivalTime }], // Lưu trường arrivalTime
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin tiến trình.');
    }
  };

  handleDeleteProcess = id => {
    const { processes } = this.state;
    const updatedProcesses = processes.filter(process => process.id !== id);
    this.setState({
      processes: updatedProcesses,
    });
  };

  handleReset = () => {
    this.setState({
      processes: [],
      currentTime: 0,
      completedProcesses: [],
    });
  };

  render() {
    const { processes, currentTime, completedProcesses } = this.state;
    const totalTime = 100;
    const columnWidth = 10;

    return (
      <div className="cpu-scheduling-simulation">
        <h1>CPU Scheduling Simulation (Priority Scheduling)</h1>
        <div className="add-process-form">
          <input type="text" placeholder="Process name" ref={this.processNameInput} />
          <input type="number" placeholder="Arrival Time" ref={this.processArrivalTimeInput} /> {/* Thêm trường arrivalTime */}
          <input type="number" placeholder="Priority" ref={this.processPriorityInput} />
          <input type="number" placeholder="Time" ref={this.processTimeInput} />
          
          <button onClick={this.handleAddProcess}>Add</button>
        </div>
        <div className="process-list">
          <h2>Process List</h2>
          <table>
            <thead>
              <tr>
                <th>Process name</th>
                <th>Arrival Time</th> {/* Thêm cột Arrival Time */}
                <th>Priority</th>
                <th>Time</th>
        
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(process => (
                <tr key={process.id}>
                  <td>{process.name}</td>
                  <td>{process.arrivalTime}</td> {/* Hiển thị giá trị Arrival Time */}
                  <td>{process.priority}</td>
                  <td>{process.time}</td>
                  
                  <td>
                    <button onClick={() => this.handleDeleteProcess(process.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="controls">
          <button onClick={this.handleRunSimulation} disabled={completedProcesses.length > 0}>
            Run
          </button>
          <button onClick={this.handleReset}>Reset</button>
        </div>
        <div className="table-container">
          <div className="table-scroll">
            <table className="process-table">
              <thead>
                <tr>
                  <th>Process name</th>
                  {Array(totalTime)
                    .fill()
                    .map((_, index) => (
                      <th
                        key={index}
                        className={currentTime === index ? 'running' : ''}
                        style={{ width: columnWidth }}
                      >
                        {index}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {processes.map(process => (
                  <tr key={process.id}>
                    <td>{process.name}</td>
                    {Array(totalTime)
                      .fill()
                      .map((_, index) => (
                        <td
                          key={index}
                          className={
                            completedProcesses.some(item => {
                              return item.id === process.id && index >= item.startTime && index < item.endTime;
                            })
                              ? 'completed'
                              : ''
                          }
                          style={{ width: columnWidth }}
                        ></td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <CPUSchedulingSimulation />
    </div>
  );
}

export default App;
