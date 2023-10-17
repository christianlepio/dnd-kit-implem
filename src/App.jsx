import { useState } from 'react'
import './App.css'
import KanbanBoard from './components/KanbanBoard'

function App() {
  return (
    <>
      <div className="m-4">
        <KanbanBoard />
      </div>
    </>
  )
}

export default App
