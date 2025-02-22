import axios from "axios";

const API_URL = "https://workorg-server.onrender.com";

export const getTasks = async (email) => {
    const response = await axios.get(`${API_URL}/tasks`, { params: { email } });
    console.log(response.data);
    return response.data;
};

export const createTask = async (task) => {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
};

export const updateTask = async (id, updatedTask) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, updatedTask);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
};

export const updateTaskOrder = async (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        console.error("Invalid tasks sent for reordering:", tasks);
        return { success: false, message: "Invalid task order data." };
    }

    try {
        const response = await axios.put(`${API_URL}/tasks/reorder`, { reorderedTasks: tasks });
        return response.data;
    } catch (error) {
        console.error("Failed to reorder tasks:", error);
        throw new Error("Failed to reorder tasks.");
    }
};