import React from 'react'

type Props = {}

function Bridger({}: Props) {
  return (
    <div className='bridger-container'>
        <h2>Input here</h2>
        
        to
        
        <h2>Input here</h2>

        <button>Bridge</button>

        <style jsx>{`
        .bridger-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default Bridger