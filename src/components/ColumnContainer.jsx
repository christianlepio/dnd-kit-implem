import { SortableContext, useSortable } from '@dnd-kit/sortable'
import React, { useMemo } from 'react'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'

const ColumnContainer = ({column, deleteColumn, createTask, tasks}) => {
    const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks])

    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({
        id: column.id,
        data: {
            type: "Column", 
            column,
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    
    if (isDragging) {
        return <div ref={setNodeRef}
        className="mx-2 border border-danger rounded-3 col-content"
        style={style}>

        </div>
    }

    return (
        <>
            <div 
                ref={setNodeRef}
                className="mx-2 border rounded-3 col-content"
                style={style}
            >
                {/* title */}
                <div 
                    {...attributes}
                    {...listeners}
                    className='p-2 d-flex justify-content-between col-title' 
                >
                    <h5 className='lh-lg'>{column.title}</h5>
                    <button 
                        className='btn btn-sm btn-outline-secondary'
                        onClick={() => deleteColumn(column.id)}
                    >
                        Delete
                    </button>
                </div>
                {/* content */}
                <div className='overflow-y-auto border col-body'>
                    <SortableContext items={tasksIds}>
                        {tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </div>
                {/* footer */}
                <div className='d-flex justify-content-center'>
                    <button 
                        className="btn btn-outline-secondary mt-2"
                        onClick={() => createTask(column.id)}
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </>
    )
}

export default ColumnContainer