import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
//install using npm i uuid
import { v4 as uuid } from 'uuid'
import ColumnContainer from './ColumnContainer'
import TaskCard from './TaskCard'

const KanbanBoard = () => {
    const [columns, setColumns] = useState([])
    const [tasks, setTasks] = useState([])
    const [activeColumn, setActiveColumn] = useState(null)
    const [activeTask, setActiveTask] = useState(null)

    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

    const createNewColumn = () => {
        setColumns([...columns, {id: uuid(), title: `Columns ${columns.length + 1}`}])
    }

    const deleteColumn = (id) =>{
        const filteredColumns = columns.filter(col => col.id !== id)
        setColumns(filteredColumns)
    }

    const createTask = (id) => {
        const newTask = {
            id: uuid(),
            columnId: id, 
            content: `Task ${tasks.length + 1}`, 
        }
        setTasks([...tasks, newTask])
    }

    const onDragStart = (e) => {
        // console.log(e)
        if (e.active.data.current?.type === "Column") {
            setActiveColumn(e.active.data.current.column)
            return
        }

        if (e.active.data.current?.type === "Task") {
            setActiveTask(e.active.data.current.task)
            return
        }
    }

    const onDragEnd = (e) => {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = e

        if (!over) 
            return

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) 
            return

        const isActiveAColumn = active.data.current?.type === 'Column' 
        const isOverAColumn = over.data.current?.type === 'Column'

        if (!isActiveAColumn) return

        if (isActiveAColumn && isOverAColumn) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(
                    col => col.id === activeColumnId
                )
    
                const overColumnIndex = columns.findIndex(
                    col => col.id === overColumnId
                )
    
                return arrayMove(columns, activeColumnIndex, overColumnIndex)
            })
        }
    }

    const onDragOver = (e) => {
        const { active, over } = e

        if (!over) return

        const activeTaskId = active.id
        const overTaskId = over.id

        if (activeTaskId === overTaskId) return

        const isActiveATask = active.data.current?.type === 'Task' 
        const isOverATask = over.data.current?.type === 'Task'

        if (!isActiveATask) return

        //Im dropping a task over another task
        // if (isActiveATask && isOverATask) {
        //     setTasks(tasks => {
        //         const activeIndex = tasks.findIndex(task => task.id === activeTaskId)
        //         const overIndex = tasks.findIndex(task => task.id === overTaskId)

        //         tasks[activeIndex].columnId = tasks[overIndex].columnId

        //         return arrayMove(tasks, activeIndex, overIndex)
        //     })
        //     console.log('DRAGOVER: ', e)
        // }

        const isOverAColumn = over.data.current?.type === 'Column'

        //Im dropping a taks over a column
        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeTaskId)

                tasks[activeIndex].columnId = overTaskId

                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }else if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeTaskId)
                const overIndex = tasks.findIndex(task => task.id === overTaskId)

                tasks[activeIndex].columnId = tasks[overIndex].columnId

                return arrayMove(tasks, activeIndex, overIndex)
            })
            console.log('DRAGOVER: ', e)
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    )

    return (
        <>
            <div className='
                d-flex 
                justify-content-center 
            '>
                <DndContext 
                    sensors={sensors} 
                    onDragStart={onDragStart} 
                    onDragEnd={onDragEnd} 
                    onDragOver={onDragOver}
                >
                    <SortableContext items={columnsId}>
                        {columns.length > 0 ? 
                            columns.map(col => (
                                <ColumnContainer 
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === col.id)}
                                />
                            ))                    
                        : null}
                    </SortableContext>
                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer 
                                    column={activeColumn} 
                                    deleteColumn={deleteColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                                />
                            )}
                            {activeTask && (
                                <TaskCard 
                                    task={activeTask}
                                />
                            )}
                        </DragOverlay>, 
                        document.body
                    )}
                
                    <div className=''>
                        <button 
                            className="btn btn-outline-secondary px-5" 
                            onClick={createNewColumn}
                        >
                            Add Column
                        </button>
                    </div>
                </DndContext>
            </div>
        </>
    )
}

export default KanbanBoard