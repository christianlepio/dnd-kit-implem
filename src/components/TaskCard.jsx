import { useSortable } from '@dnd-kit/sortable'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'

const TaskCard = ({task}) => {
    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({
        id: task.id,
        data: {
            type: "Task", 
            task,
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (
            <div 
                ref={setNodeRef}
                style={style}
                className='p-2 py-5 my-2 mx-2 px-3 border rounded-3'
            >
            </div>)
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className='p-2 d-flex py-4 my-2 mx-2 px-3 task-content border rounded-3 justify-content-between' 
                key={task.id}
            >
                <p>{task.content}</p>
                <div 
                    {...attributes}
                    {...listeners}>
                    <i className="fa-solid fa-grip-vertical"></i>
                </div>
                
            </div>
        </>
    )
}

export default TaskCard