import "materialize-css/dist/css/materialize.min.css";
import "./App.css";
import List from "./components/List";
import NewTaskForm from "./components/NewTaskForm";
import Header from "./components/header";
import Footer from "./components/footer";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [tasks, setTasks] = useState([]);

    const fetchData = async () => {
        const response = await axios.get("/api/tasks");
        setTasks(response.data);
    };

    //initial fetch
    useEffect(() => {
        fetchData();
    }, []);

    //response.data: task
    const handleTaskCreate = (newTask) => {
        axios.post("/api/tasks", newTask).then((response) => {
            setTasks([...tasks, response.data]);
        });
    };

    const handleTaskCheck = (thisTask) => {
        axios
            .put(`/api/tasks/check/${thisTask._id}`, thisTask)
            .then((response) => {
                setTasks(
                    tasks.map((task) => {
                        if (task._id === response.data._id) {
                            return { ...task, done: response.data.done };
                        }
                        return task;
                    })
                );
            });
    };

    const handleTaskDelete = (thisTask) => {
        axios
            .delete(`/api/tasks/${thisTask._id}`, thisTask)
            .then((response) => {
                setTasks(
                    tasks.filter((task) => task._id !== response.data._id)
                );
            });
    };

    //response.data: task
    const handleTaskUpdate = (thisTask, updateInput) => {
        if (updateInput && updateInput !== thisTask.taskName) {
            thisTask.taskName = updateInput;
            axios
                .put(`/api/tasks/${thisTask._id}`, thisTask)
                .then((response) => {
                    setTasks(
                        tasks.map((task) => {
                            if (task._id === response.data._id) {
                                return response.data;
                            }
                            return task;
                        })
                    );
                });
        }
    };
    return (
        <div>
            <div className="App container">
                <Header />
                <div className="row tasks">
                    <div className="col s12 m12 l8 offset-l2">
                        <List
                            tasks={tasks}
                            onTaskDelete={handleTaskDelete}
                            onTaskCheck={handleTaskCheck}
                            onTaskUpdate={handleTaskUpdate}
                        />
                    </div>
                </div>
                <div className="row create">
                    <div className="col s12 m12 l8 offset-l2">
                        <NewTaskForm onNewTask={handleTaskCreate} />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default App;
