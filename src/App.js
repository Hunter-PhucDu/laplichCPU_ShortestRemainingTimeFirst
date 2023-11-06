import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class CPUSchedulingSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      initialProcesses: [],
      currentTime: 0,
      completedProcesses: [],
      isRunning: false,
      isSimulated: false,
      isPaused: false,
    };
    this.processNameInput = React.createRef();
    this.processArrivalTimeInput = React.createRef();
    this.processTimeInput = React.createRef();
    this.runTimeout = null;
  }

  handleRunSimulation = async () => {
    const { processes, isRunning, isPaused } = this.state;

    if (processes.length === 0) {
      alert('Danh sách tiến trình trống!');
      return;
    }

    if (isRunning) {
      alert('Mô phỏng đang chạy!');
      return;
    }

    this.setState({ isRunning: true });

    const runStep = async () => {
      if (this.state.processes.some(process => process.time > 0)) {
        if (!isPaused) {
          const availableProcesses = this.state.processes.filter(
            process => process.time > 0 && process.arrivalTime <= this.state.currentTime
          );

          if (availableProcesses.length === 0) {
            const newCurrentTime = this.state.currentTime + 1;
            this.setState({ currentTime: newCurrentTime });
            this.runTimeout = setTimeout(runStep, 100);
            return;
          }

          const nextProcess = availableProcesses.reduce((min, process) => {
            return process.time < min.time ? process : min;
          }, availableProcesses[0]);

          const remainingProcesses = this.state.processes.map(process =>
            process.id === nextProcess.id ? { ...process, time: process.time - 1 } : process
          );

          const newCompletedProcesses = [
            ...this.state.completedProcesses,
            { id: nextProcess.id, startTime: this.state.currentTime, endTime: this.state.currentTime + 1 },
          ];

          const newCurrentTime = this.state.currentTime + 1;
          this.setState({ processes: remainingProcesses, completedProcesses: newCompletedProcesses, currentTime: newCurrentTime });
          if (!isPaused) {
            /* chỉnh thời gian delay khi chạy tiến trình */
            this.runTimeout = setTimeout(runStep, 400);
          }
        }
      } else {
        this.setState({ isRunning: false, isSimulated: true, isPaused: false });
      }
    };

    runStep();
  };

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  handleAddProcess = () => {
    const { isRunning, isSimulated } = this.state;
    const name = this.processNameInput.current.value;
    const time = this.processTimeInput.current.value;
    const arrivalTime = this.processArrivalTimeInput.current.value;

    if (isRunning) {
      alert('Dừng mô phỏng trước khi thêm tiến trình.');
      return;
    }

    if (isSimulated) {
      alert('Mô phỏng đã hoàn thành, bạn cần ấn "Refresh" để chạy lại.');
      return;
    }

    if (name && time && arrivalTime) {
      // Kiểm tra xem tên tiến trình đã tồn tại trong danh sách chưa
      if (this.state.initialProcesses.some(process => process.name === name)) {
        alert('Tên tiến trình đã tồn tại. Vui lòng chọn tên khác.');
        return;
      }

      const id = this.state.initialProcesses.length + 1;
      this.setState(prevState => ({
        processes: [...prevState.processes, { id, name, time, arrivalTime }],
        initialProcesses: [...prevState.initialProcesses, { id, name, time, arrivalTime }],
      }));
      this.processNameInput.current.value = '';
      this.processTimeInput.current.value = '';
      this.processArrivalTimeInput.current.value = '';
    } else {
      alert('Vui lòng điền đầy đủ thông tin tiến trình.');
    }
  };


  handleDeleteProcess = id => {
    const { isRunning, isSimulated } = this.state;

    if (isRunning) {
      alert('Dừng mô phỏng trước khi xóa tiến trình.');
      return;
    }

    if (isSimulated) {
      alert('Mô phỏng đã hoàn thành, bạn cần ấn "Refresh" để xóa tiến trình.');
      return;
    }

    const updatedProcesses = this.state.processes.filter(process => process.id !== id);
    this.setState(prevState => ({
      processes: updatedProcesses,
      initialProcesses: prevState.initialProcesses.filter(process => process.id !== id),
      currentTime: 0,
      completedProcesses: [],
    }));
  };

  handleResetPage = () => {
    const { isRunning } = this.state;

    if (isRunning) {
      alert('Dừng mô phỏng trước khi đặt lại.');
      return;
    }

    this.setState({
      processes: [],
      initialProcesses: [],
      currentTime: 0,
      completedProcesses: [],
      isRunning: false,
      isSimulated: false,
      isPaused: false,
    });
  };

  handleReFresh = () => {
    const { isRunning, initialProcesses } = this.state;

    if (isRunning) {
      alert('Dừng mô phỏng trước khi đặt lại.');
      return;
    }

    this.setState({
      processes: [...initialProcesses],
      currentTime: 0,
      completedProcesses: [],
      isRunning: false,
      isSimulated: false,
      isPaused: false,
    });
  };

  handleStop = () => {
    this.clearRunTimeout();
  };

  handleContinue = () => {
    this.setState({ isPaused: false }, () => {
      this.runStep();
    });
  };

  runStep = () => {
    if (this.state.processes.some(process => process.time > 0)) {
      if (!this.state.isPaused) {
        const availableProcesses = this.state.processes.filter(
          process => process.time > 0 && process.arrivalTime <= this.state.currentTime
        );

        if (availableProcesses.length === 0) {
          const newCurrentTime = this.state.currentTime + 1;
          this.setState({ currentTime: newCurrentTime });
          this.runTimeout = setTimeout(this.runStep, 100);
          return;
        }

        const nextProcess = availableProcesses.reduce((min, process) => {
          return process.time < min.time ? process : min;
        }, availableProcesses[0]);

        const remainingProcesses = this.state.processes.map(process =>
          process.id === nextProcess.id ? { ...process, time: process.time - 1 } : process
        );

        const newCompletedProcesses = [
          ...this.state.completedProcesses,
          { id: nextProcess.id, startTime: this.state.currentTime, endTime: this.state.currentTime + 1 },
        ];

        const newCurrentTime = this.state.currentTime + 1;
        this.setState({ processes: remainingProcesses, completedProcesses: newCompletedProcesses, currentTime: newCurrentTime });

        if (!this.state.isPaused) {
          this.runTimeout = setTimeout(this.runStep, 400);
        }
      }
    } else {
      this.setState({ isRunning: false, isSimulated: true, isPaused: false });
    }
  };

  clearRunTimeout = () => {
    if (this.runTimeout) {
      clearTimeout(this.runTimeout);
    }
    this.setState({ isPaused: true });
  };

  render() {
    const { initialProcesses, isRunning, isSimulated, isPaused } = this.state;
    const totalTime = 200;
    const columnWidth = 10;
    const currentTime = this.state.currentTime;

    return (
      <div className="cpu-scheduling-simulation">
        <br />
        <h2>Nguyên lý hệ điều hành</h2>
        <h2>Bài tập lớn: Mô phỏng giải thuật lập lịch CPU SRTF (Shortest Remaining Time First)</h2>
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
              {initialProcesses.map(process => (
                <tr key={process.id}>
                  <td>{process.name}</td>
                  <td>{process.arrivalTime}</td>
                  <td>
                    {process.name === 'CPU Burst Time' ? (
                      <div>{process.time}</div>
                    ) : (
                      process.time
                    )}
                  </td>
                  <td>
                    <button onClick={() => this.handleDeleteProcess(process.id)} disabled={isRunning}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div className="add-process-form">
          <input type="text" placeholder="Process name" ref={this.processNameInput} />
          <input type="number" placeholder="Arrival Time" ref={this.processArrivalTimeInput} />
          <input type="number" placeholder="CPU Burst Time" ref={this.processTimeInput} />
          <button onClick={this.handleAddProcess}>Add</button>
        </div>
        <div className="controls">
          <div>
            <button onClick={isRunning ? null : isSimulated ? this.handleReFresh : this.handleRunSimulation} disabled={isRunning}>
              {isRunning ? 'Running...' : isSimulated ? 'Refresh' : 'Run'}
            </button>
            <button onClick={this.handleResetPage} disabled={isRunning}>
              Reset
            </button>
            <button onClick={this.handleStop} disabled={!isRunning || isPaused}>
              Stop
            </button>
            <button onClick={this.handleContinue} disabled={!isPaused || isSimulated}>
              Continue
            </button>
          </div>
        </div>
        <div className='moPhong'>Mô phỏng</div>
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
                        className={currentTime === index + 1 ? 'running' : ''}
                        style={{ width: columnWidth }}
                      >
                        {index}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {initialProcesses.map(process => (
                  <tr key={process.id}>
                    <td>{process.name}</td>
                    {Array(totalTime)
                      .fill()
                      .map((_, index) => (
                        <td
                          key={index}
                          className={
                            this.state.completedProcesses.some(item => {
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
    <div className="App" >
      <CPUSchedulingSimulation />
    </div>
  );
}

export default App;
