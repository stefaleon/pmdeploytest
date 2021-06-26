import axios from 'axios';
import { createContext } from 'react';
import { NEXT_URL } from 'config/index';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const createCategory = async (data) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/categories/create`, data);
      console.log('in AppContext createCategory - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const res = await axios.put(
        `${NEXT_URL}/api/categories/update/${id}`,
        data
      );
      console.log('in AppContext updateCategory - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`${NEXT_URL}/api/categories/delete/${id}`);
      console.log('in AppContext deleteCategory - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createPerson = async (data) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/people/create`, data);
      console.log('in AppContext createPerson - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePerson = async (id, data) => {
    try {
      const res = await axios.put(`${NEXT_URL}/api/people/update/${id}`, data);
      console.log('in AppContext updatePerson - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePerson = async (id) => {
    try {
      const res = await axios.delete(`${NEXT_URL}/api/people/delete/${id}`);
      console.log('in AppContext deletePerson - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (data) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/tasks/create`, data);
      console.log('in AppContext createTask - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (id, data) => {
    try {
      const res = await axios.put(`${NEXT_URL}/api/tasks/update/${id}`, data);
      console.log('in AppContext updateTask - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${NEXT_URL}/api/tasks/delete/${id}`);
      console.log('in AppContext deleteTask - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async (data) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/projects/create`, data);
      console.log('in AppContext createProject - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async (id, data) => {
    try {
      const res = await axios.put(
        `${NEXT_URL}/api/projects/update/${id}`,
        data
      );
      console.log('in AppContext updateProject - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createProjectTask = async (data) => {
    try {
      const res = await axios.post(
        `${NEXT_URL}/api/project_tasks/create`,
        data
      );
      console.log('in AppContext createProjectTask - res.data', res.data);
      return res.data; // not required here, we don't redirect, for future use
    } catch (error) {
      console.log(error);
    }
  };

  const updateProjectTask = async (id, data) => {
    try {
      const res = await axios.put(
        `${NEXT_URL}/api/project_tasks/update/${id}`,
        data
      );
      console.log('in AppContext updateProjectTask - res.data', res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProjectTask = async (id) => {
    try {
      const res = await axios.delete(
        `${NEXT_URL}/api/project_tasks/delete/${id}`
      );
      console.log('in AppContext deleteProjectTask - res.data', res.data);
      return res.data; // not required here, we don't redirect, for future use
    } catch (error) {
      console.log(error);
    }
  };

  const createProjectMember = async (data) => {
    try {
      const res = await axios.post(
        `${NEXT_URL}/api/project_members/create`,
        data
      );
      console.log('in AppContext createProjectMember - res.data', res.data);
      return res.data; // not required here, we don't redirect, for future use
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProjectMember = async (id) => {
    try {
      const res = await axios.delete(
        `${NEXT_URL}/api/project_members/delete/${id}`
      );
      console.log('in AppContext deleteProjectMember - res.data', res.data);
      return res.data; // not required here, we don't redirect, for future use
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        createCategory,
        updateCategory,
        deleteCategory,
        createPerson,
        updatePerson,
        deletePerson,
        createTask,
        updateTask,
        deleteTask,
        createProject,
        updateProject,
        createProjectTask,
        updateProjectTask,
        deleteProjectTask,
        createProjectMember,
        deleteProjectMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
