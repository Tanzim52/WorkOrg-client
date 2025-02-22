import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getTasks, updateTaskOrder, updateTask, deleteTask } from "../utils/api";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm";
import { socket } from "../utils/socket";
import { RiTodoLine } from "react-icons/ri";
import { FcTodoList } from "react-icons/fc";
import { GrInProgress } from "react-icons/gr";
import { IoCalendarNumber } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const [tasks, setTasks] = useState({
        "To-Do": [],
        "In Progress": [],
        "Done": [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        loadTasks();

        socket.on("taskCreated", (data) => {
            setTasks((prevTasks) => ({
                ...prevTasks,
                [data.task.category]: [...prevTasks[data.task.category], data.task],
            }));
        });

        socket.on("tasksReordered", (data) => {
            setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
                data.reorderedTasks.forEach((task) => {
                    updatedTasks[task.category] = updatedTasks[task.category].map((t) =>
                        t._id === task._id ? task : t
                    );
                });

                Object.keys(updatedTasks).forEach((category) => {
                    updatedTasks[category].sort((a, b) => a.order - b.order);
                });

                return updatedTasks;
            });
        });

        socket.on("taskDeleted", (data) => {
            setTasks((prevTasks) => {
                if (!prevTasks[data.taskCategory]) return prevTasks;

                return {
                    ...prevTasks,
                    [data.taskCategory]: prevTasks[data.taskCategory].filter((task) => task._id !== data.taskId),
                };
            });
        });

        return () => {
            socket.off("taskCreated");
            socket.off("tasksReordered");
            socket.off("taskDeleted");
        };
    }, []);

    const loadTasks = async () => {
        try {
            if (user.email) {  
                const data = await getTasks(user.email);
    
                const organizedTasks = {
                    "To-Do": [],
                    "In Progress": [],
                    "Done": [],
                };
    
                data.forEach((task) => {
                    if (organizedTasks[task.category]) {
                        organizedTasks[task.category].push(task);
                    }
                });
    
                Object.keys(organizedTasks).forEach((category) => {
                    organizedTasks[category].sort((a, b) => a.order - b.order);
                });
    
                setTasks(organizedTasks);
            }
        } catch (error) {
            toast.error("Failed to load tasks.");
        }
    };

    const handleDelete = async (id, category) => {
        try {
            await deleteTask(id);
            setTasks((prevTasks) => {
                if (!prevTasks[category]) return prevTasks;
                return {
                    ...prevTasks,
                    [category]: prevTasks[category].filter((task) => task._id !== id),
                };
            });
            toast.success("Task deleted successfully!");
            loadTasks();
        } catch (error) {
            toast.error("Failed to delete task.");
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const newTasks = { ...tasks };

        const movedTask = newTasks[source.droppableId][source.index];
        newTasks[source.droppableId].splice(source.index, 1);
        newTasks[destination.droppableId].splice(destination.index, 0, movedTask);

        // Update order for all tasks in the destination category
        newTasks[destination.droppableId] = newTasks[destination.droppableId].map((task, index) => ({
            ...task,
            category: destination.droppableId,
            order: index + 1,
        }));

        setTasks(newTasks);

        try {
            await updateTaskOrder(newTasks[destination.droppableId]);
            toast.success("Task reordered successfully!");
        } catch (error) {
            toast.error("Failed to reorder tasks.");
        }
    };

    console.log(tasks);

    return (
        <div>

            <nav className="bg-white/[0.6] backdrop-blur-md sticky top-0 z-20">
                <Navbar setIsModalOpen={setIsModalOpen}></Navbar>
            </nav>

            <section className="w-[90%] mx-auto min-h-screen relative pt-4 sm:pt-6 xl:pt-6 pb-10 sm:pb-16 xl:pb-20">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h1>

                {isModalOpen && (
                    <TaskForm
                        task={editingTask}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingTask(null);
                        }}
                        onTaskUpdated={loadTasks}
                    />
                )}

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {["To-Do", "In Progress", "Done"].map((category) => (
                            <Droppable key={category} droppableId={category}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-blue-50 p-5 rounded-xl shadow-lg border border-gray-200 min-h-[300px]"
                                    >
                                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                                            {category === "To-Do" && <RiTodoLine />}
                                            {category === "In Progress" && <GrInProgress />}
                                            {category === "Done" && <FcTodoList />}
                                            <span className="ml-1">{category}</span>
                                        </h2>

                                        <div className="space-y-3">
                                            {tasks[category].map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`p-5 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full space-y-3 ${snapshot.isDragging ? "bg-gray-100 scale-105" : ""
                                                                }`}
                                                        >
                                                            <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2"><IoCalendarNumber className="inline scale-125" />{new Date(task.timestamp).toLocaleString()}</p>
                                                            <p className="text-sm text-gray-500"><MdDescription className="inline scale-[1.3] mr-1" /> {task.description}</p>
                                                            <div className="w-full flex justify-between items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingTask(task);
                                                                            setIsModalOpen(true);
                                                                        }}
                                                                        className="btn btn-xs bg-gradient-to-r from-blue-500 to-blue-700 text-white border-none rounded-lg"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDelete(task._id);
                                                                        }}
                                                                        className="btn btn-xs btn-error text-white border-none rounded-lg"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${task.category === "Done"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : task.category === "In Progress"
                                                                                ? "bg-yellow-100 text-yellow-700"
                                                                                : "bg-gray-100 text-gray-700"
                                                                        }`}
                                                                >
                                                                    {task.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </section>

            <footer className="bg-blue-50">
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default Home;
