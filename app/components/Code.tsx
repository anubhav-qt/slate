'use client';

import { useState } from 'react';
import { FiPlay, FiSquare, FiRefreshCw, FiSave, FiCode } from 'react-icons/fi';

export default function ChatBox() {
    const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default
    const [code, setCode] = useState(`// Write your code here
// Example:
let arr = [1, 2, 3];
arr.push(4);
console.log(arr);`);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleRunCode = () => {
        // Placeholder for future functionality
        console.log('Running code:', code);
    };

    const handleStopCode = () => {
        // Placeholder for future functionality
        console.log('Stopping code execution');
    };

    const handleResetCode = () => {
        setCode(`// Write your code here
// Example:
let arr = [1, 2, 3];
arr.push(4);
console.log(arr);`);
    };

    const handleSaveCode = () => {
        // Placeholder for future functionality
        console.log('Saving code:', code);
    };

    return (
        <div
            className={`bg-gray-900 border-l border-gray-700 transition-all duration-300 ease-in-out ${
                isExpanded ? 'w-80' : 'w-16'
            } flex flex-col shadow-lg`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                {isExpanded && (
                    <h2 className="text-lg font-semibold text-white">Code</h2>
                )}
                <button
                    onClick={toggleExpanded}
                    className="p-1 rounded-md hover:bg-gray-800 transition-colors"
                >
                    {isExpanded ? (
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {isExpanded ? (
                <>
                    {/* Code Editor Area */}
                    <div className="flex-1 p-4 flex flex-col">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white font-mono resize-none"
                            placeholder="Write your code here..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="space-y-2">
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleRunCode}
                                    className="flex items-center space-x-2 flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                                >
                                    <FiPlay className="w-4 h-4" />
                                    <span>Run</span>
                                </button>
                                <button
                                    onClick={handleStopCode}
                                    className="flex items-center space-x-2 flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                >
                                    <FiSquare className="w-4 h-4" />
                                    <span>Stop</span>
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleResetCode}
                                    className="flex items-center space-x-2 flex-1 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                                >
                                    <FiRefreshCw className="w-4 h-4" />
                                    <span>Reset</span>
                                </button>
                                <button
                                    onClick={handleSaveCode}
                                    className="flex items-center space-x-2 flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <FiSave className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl mb-2">
                        <FiCode className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            )}
        </div>
    );
}
