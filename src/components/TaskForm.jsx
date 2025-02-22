import { use, useContext, useState } from "react";
import { createTask, updateTask } from "../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthProvider";

const TaskForm = ({ task, onClose, onTaskUpdated }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState(task?.category || "To-Do");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }

    try {
      if (task) {
        // Update task
        await updateTask(task._id, { title, description, category });
        toast.success("Task updated successfully!");
      } else {
        // Create task
        await createTask({ title, description, category, userId: user.email });
        toast.success("Task added successfully!");
      }
      onTaskUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to save task.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{task ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            className="input input-bordered w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Short Notes"
            className="textarea textarea-bordered w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="select select-bordered w-full mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div className="flex justify-between">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{task ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
