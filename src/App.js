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
    this.processArrivalTimeInput = React.createRef();
    this.processTimeInput = React.createRef();
  }

  handleRunSimulation = () => {
    const { processes, currentTime, completedProcesses } = this.state;

    if (processes.length === 0) {
      alert('Danh sách tiến trình trống!');
      return;
    }

    const availableProcesses = processes.filter(
      process => process.time > 0 && process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      alert('Hết tiến trình hoặc chưa có tiến trình nào đến.');
      return;
    }

    // Tìm tiến trình có thời gian còn lại nhỏ nhất và chưa hoàn thành
    const nextProcess = availableProcesses.reduce((min, process) => {
      return process.time < min.time ? process : min;
    }, availableProcesses[0]);

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
    const time = this.processTimeInput.current.value;
    const arrivalTime = this.processArrivalTimeInput.current.value;
    const id = processes.length + 1;

    if (name && time && arrivalTime) {
      this.setState({
        processes: [...processes, { id, name, time, arrivalTime }],
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
        <h1>CPU Scheduling Simulation (Shortest Remaining Time First)</h1>
        <div className="add-process-form">
          <input type="text" placeholder="Process name" ref={this.processNameInput} />
          <input type="number" placeholder="Arrival Time" ref={this.processArrivalTimeInput} />
          <input type="number" placeholder="CPU Burst Time" ref={this.processTimeInput} />
          <button onClick={this.handleAddProcess}>Add</button>
        </div>
        <div className="process-list">
          <h2>Process List</h2>
          <table>
            <thead>
              <tr>
                <th>Process name</th>
                <th>Arrival Time</th>
                <th>CPU Burst Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(process => (
                <tr key={process.id}>
                  <td>{process.name}</td>
                  <td>{process.arrivalTime}</td>
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
