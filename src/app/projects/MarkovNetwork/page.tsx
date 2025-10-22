"use client"

import { Navbar } from "@/components"

export default function MarkovNetwork() {
    return <>
        <Navbar />
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Markov Network Office Occupancy Prediction</h1>
            <p className="mb-4">
                This project involves developing a Markov Network model to predict office occupancy and transitions between rooms. The model analyzes historical occupancy data to forecast future room usage patterns, which can help optimize space utilization and energy consumption.
            </p>
        </div>
    </>
    
}