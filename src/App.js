import { useState, useEffect } from 'react'

import TaskList from './components/tasks';
import AddTask from './components/AddTask';

import { Heading, VStack, useToast } from "@chakra-ui/react";


function App() {

    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const allTasksDone = JSON.parse(localStorage.getItem('tasks_done')) || [];

    const toast = useToast();
    const [tasks, setTasks] = useState(allTasks);
    const [tasksDone, setTasksDone] = useState(allTasksDone);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('tasks_done', JSON.stringify(tasksDone));
    }, [tasks, tasksDone]);

    function deleteTask(id){
        const newTasks = tasks.filter((task) => {
            return task.id !== id;
        });
        setTasks(newTasks);
    }

    function deleteTaskAll(){
        setTasks([]);
        setTasksDone([]);
    }

    function checkTask(task){
        if (task.check) {

            // process checked
            const checkToggledBox = tasksDone.filter(t => t.id === task.id);
            const getAllChecked = tasksDone.filter(t => t.id !== task.id);

            checkToggledBox[0].check = false;
            
            setTasksDone(getAllChecked);
            setTasks(prev => ([...prev, ...checkToggledBox]));

        }else {

            const checkToggledBox = tasks.filter(t => t.id === task.id);
            const getAllUnChecked = tasks.filter(t => t.id !== task.id);

            checkToggledBox[0].check = true;

            setTasks(getAllUnChecked);
            setTasksDone(prev => ([...prev, ...checkToggledBox]));

        }
    }

    function updateTask(id, body, onClose){

        const info = body.trim();

        if (!info) {
            toast({
                title: 'Digite sua tarefa',
                position: 'top',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            
            return;
        }

        const newTasksUpdate = tasks.map((task) => {
            if (task.id === id){
               task.body = body;
               task.check = false
            }
            return task;
        });

        setTasks(newTasksUpdate);

        onClose();
    }

    function addTask(task){
        setTasks([...tasks, task]);
    }


    return(
        <VStack p={4} minH='100vh' pb={28}>
            
            <Heading
                p='5'
                fontWeight='extrabold'
                size='xl'
                bg='white'
                bgClip='text'
            >
                Lista de tarefas
            </Heading>
            <AddTask addTask={addTask} />
            <TaskList tasks={tasks} tasksDone={tasksDone} updateTask={updateTask} deleteTask={deleteTask} deleteTaskAll={deleteTaskAll} checkTask={checkTask}/>
        </VStack>
    );
}

export default App;

