import React from 'react'
import config from '../../config'

type Props = {
    text: string;
    click: any;
}

function StdButton({text, click}: Props) {
  return (
    <>
        <button className="std-btn">{text}</button>
        <style jsx>{`
            .std-btn {
            border: 1px solid rgba(183, 168, 168, 0.35);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            margin-top: 1em;
            padding: 0.75em 2.5em;
            background-color: ${config.palette.maker};
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            transition: all 150ms;
            }

            .std-btn:hover {
            transform: scale(1.05);
            cursor: pointer;
            }

            .std-btn:active {
            transform: scale(0.95);`
        }
        </style>
    </>
  )
}

export default StdButton