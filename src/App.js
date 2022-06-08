import { useState, useEffect } from 'react'

import TaskList from './components/tasks';
import AddTask from './components/AddTask';

import { Heading, VStack, useToast } from "@chakra-ui/react";
import { 
    INITIAL_ORDER_STATE, 
    ORDER_BY_ASCENDING_ORDER,
    ORDER_BY_DESCENDING_ORDER 
} from './constants';


function App() {

    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const allTasksInitialOrder = JSON.parse(localStorage.getItem('tasks_initial_order')) || [];
    const allTasksDone = JSON.parse(localStorage.getItem('tasks_done')) || [];
    const orderState = parseInt(localStorage.getItem('order_state')) || 0;

    let initialTasksSortOrder = allTasksInitialOrder;
    //let initialTasksDoneSortOrder = allTasksDone;

    const toast = useToast();
    const [tasks, setTasks] = useState(allTasks);
    const [tasksInitialOrder, setTasksInitialOrder] = useState(allTasksInitialOrder);
    const [tasksDone, setTasksDone] = useState(allTasksDone);
    const [timesOrderedButtonClicked, setTimesOrderedButtonClicked] = useState(orderState);

    useEffect(() => {
        localStorage.setItem('tasks_initial_order', JSON.stringify(tasksInitialOrder));
    }, [tasksInitialOrder]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('tasks_done', JSON.stringify(tasksDone));
    }, [tasks, tasksDone]);

    useEffect(() => {
        localStorage.setItem('order_state', parseInt(timesOrderedButtonClicked));
    }, [timesOrderedButtonClicked]);

    function removeItemFromList(list, id) {
        const newList = list.filter((task) => {
            return task.id !== id;
        });
        return newList;
    }

    function deleteTask(id){
        const newTasks = removeItemFromList(tasks, id);
        const newInitialTaskOrder = removeItemFromList(tasksInitialOrder, id);

        setTasksInitialOrder(newInitialTaskOrder);
        setTasks(newTasks);
    }

    function deleteTaskAll(){
        setTasks([]);
        setTasksDone([]);
        setTasksInitialOrder([]);
        setTimesOrderedButtonClicked(0);
    }

    function checkTask(task){
        if (task.check) {

            // process checked
            const checkToggledBox = tasksDone.filter(t => t.id === task.id);
            const getAllChecked = tasksDone.filter(t => t.id !== task.id);

            checkToggledBox[0].check = false;

            addTask(setTasksInitialOrder, tasksInitialOrder, task);
            
            setTasksDone(getAllChecked);
            setTasks(prev => ([...prev, ...checkToggledBox]));

        }else {

            const checkToggledBox = tasks.filter(t => t.id === task.id);
            const getAllUnChecked = tasks.filter(t => t.id !== task.id);

            checkToggledBox[0].check = true;

            console.log(checkToggledBox)
            const newInitialTaskOrder = removeItemFromList(tasksInitialOrder, checkToggledBox[0].id);
            setTasksInitialOrder(newInitialTaskOrder);

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

    function addTask(callback, list, task){
        callback([...list, task]);
    }
    function addTasks(task){
        addTask(setTasks, tasks, task);
        addTask(setTasksInitialOrder, tasksInitialOrder, task);
    }

    function orderTask() {
        setTimesOrderedButtonClicked(timesOrderedButtonClicked + 1)
        if (timesOrderedButtonClicked === INITIAL_ORDER_STATE) {
            const sortedTasks = tasks.sort((a, b) => a.body.localeCompare(b.body));
            setTasks([...sortedTasks]);
        }else if (timesOrderedButtonClicked === ORDER_BY_ASCENDING_ORDER) {
            // sort by descending order
            const sortedTasks = tasks.sort((a, b) => b.body.localeCompare(a.body));
            setTasks([...sortedTasks]);

        }else if(timesOrderedButtonClicked >= ORDER_BY_DESCENDING_ORDER) {
            // go back to initial order
            setTasks([...initialTasksSortOrder]);
            setTimesOrderedButtonClicked(0)
        }
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
            <AddTask addTask={addTasks} />
            <TaskList tasks={tasks} tasksDone={tasksDone} updateTask={updateTask} deleteTask={deleteTask} deleteTaskAll={deleteTaskAll} checkTask={checkTask} orderTask={orderTask}/>
        </VStack>
    );
}

export default App;

