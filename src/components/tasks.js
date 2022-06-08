import React from 'react'

import UpdateTask from './UpdateTask';
import { DeleteTask, DeleteAllTask } from './DeleteTask';

import { HStack, Box, VStack, Flex, Text, StackDivider,Checkbox, Image, Button} from '@chakra-ui/react'

import img from '../assets/images/empty.png'

function showTasks(tasks, updateTask, deleteTask, deleteTaskAll, checkTask, isDone = false) {
    return (
        <>
            {isDone && <p>Tarefas concluídas</p>}
            <VStack
                divider={<StackDivider />}
                borderColor='gray.100'
                borderWidth='2px'
                p='5'
                borderRadius='lg'
                w='100%'
                maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
                alignItems='stretch'
            >
                
                {tasks.map((task) =>(
                    <HStack key={ task.id } opacity={ task.check === true ? '0.2' : '1' } >
                        <Checkbox isChecked={ task.check === true ? true : false } onChange={ () => checkTask(task) }></Checkbox>

                        <Text w='100%' p='8px' borderRadius='lg'>
                            {task.body}
                        </Text>

                        { !isDone && <DeleteTask task={task} deleteTask={deleteTask} deleteTaskAll={deleteTaskAll} /> }
                        { !isDone && <UpdateTask task={task} updateTask={updateTask} /> }
                    </HStack>
                ))}    
            </VStack>
        </>
    )
}

function TaskList({tasks, tasksDone, updateTask, deleteTask, deleteTaskAll, checkTask, orderTask}) {
    if (!tasks.length && !tasksDone.length) {
        
        return (
            <>
                <Box maxW='80%'>
                    <Image mt='20px' w='98%' maxW='350' src={img} alt='Sua lista está vazia :(' />
                </Box>
            </>
        );
    }
  return (
      <>
        <Button colorScheme='gray' color='gray.500' size='xs' px='8'pl='10'pr='10' h='35' type='button' onClick={orderTask}> Ordenar </Button>

        { tasks.length > 0 && showTasks(tasks, updateTask, deleteTask, deleteTaskAll, checkTask) }

        { tasksDone.length > 0 && showTasks(tasksDone, updateTask, deleteTask, deleteTaskAll, checkTask, true) }

        <Flex>
            <DeleteAllTask deleteTaskAll={deleteTaskAll} />
        </Flex>
    </>
  );
}

export default TaskList;