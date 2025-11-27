import React from 'react'
import NavLayout from '../../components/Layouts/NavLayout'
import NewsAgent from './_components/NewsAgent'

const Agents = () => {
  return (
    <NavLayout>
      <div className="p-10">
        <h1 className="text-2xl font-semibold">Agents</h1>
      </div>
      <NewsAgent />
    </NavLayout>
  )
}

export default Agents
