'use client';

import { useState } from 'react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiMinus,
    FiTrash2,
    FiRotateCcw,
    FiArrowRight,
    FiArrowLeft,
    FiArrowUp,
    FiArrowDown,
    FiSearch,
    FiEdit3,
} from 'react-icons/fi';
import {
    useDataStructure,
    DataStructure,
} from '../context/DataStructureContext';

interface CustomVariable {
    id: string;
    name: string;
    value: string;
}

export default function Toolbar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [customVariables, setCustomVariables] = useState<CustomVariable[]>(
        [],
    );

    const {
        selectedDataStructure,
        setSelectedDataStructure,
        selectedInstance,
        updateInstance,
    } = useDataStructure();

    const dataStructureOptions = [
        { value: 'array', label: 'Array' },
        { value: 'stack', label: 'Stack' },
        { value: 'queue', label: 'Queue' },
        { value: 'deque', label: 'Deque' },
    ];

    const getDataStructureActions = () => {
        const currentType = selectedInstance?.type || selectedDataStructure;

        switch (currentType) {
            case 'array':
                return [
                    {
                        icon: FiPlus,
                        label: 'Append',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiMinus,
                        label: 'Pop',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiArrowRight,
                        label: 'Insert At',
                        color: 'bg-green-600 hover:bg-green-700',
                    },
                    {
                        icon: FiSearch,
                        label: 'Find',
                        color: 'bg-purple-600 hover:bg-purple-700',
                    },
                ];
            case 'stack':
                return [
                    {
                        icon: FiArrowUp,
                        label: 'Push',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiArrowDown,
                        label: 'Pop',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiSearch,
                        label: 'Peek',
                        color: 'bg-purple-600 hover:bg-purple-700',
                    },
                ];
            case 'queue':
                return [
                    {
                        icon: FiArrowRight,
                        label: 'Enqueue',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiArrowLeft,
                        label: 'Dequeue',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiSearch,
                        label: 'Front',
                        color: 'bg-purple-600 hover:bg-purple-700',
                    },
                ];
            case 'deque':
                return [
                    {
                        icon: FiArrowRight,
                        label: 'Push Right',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiArrowLeft,
                        label: 'Push Left',
                        color: 'bg-blue-500 hover:bg-blue-600',
                    },
                    {
                        icon: FiArrowDown,
                        label: 'Pop Right',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiArrowUp,
                        label: 'Pop Left',
                        color: 'bg-red-500 hover:bg-red-600',
                    },
                ];
            default:
                return [];
        }
    };

    const getDataStructureLabel = (type: DataStructure) => {
        return (
            dataStructureOptions.find((option) => option.value === type)
                ?.label || type
        );
    };

    const addCustomVariable = () => {
        const name = prompt('Enter variable name (e.g., left, right, target):');
        if (name && name.trim()) {
            const newVariable: CustomVariable = {
                id: Date.now().toString(),
                name: name.trim(),
                value: '0',
            };
            setCustomVariables([...customVariables, newVariable]);
        }
    };

    const updateVariableValue = (id: string, value: string) => {
        setCustomVariables((prev) =>
            prev.map((variable) =>
                variable.id === id ? { ...variable, value } : variable,
            ),
        );
    };

    const removeVariable = (id: string) => {
        setCustomVariables((prev) =>
            prev.filter((variable) => variable.id !== id),
        );
    };

    const handleDataStructureAction = (actionLabel: string) => {
        if (!selectedInstance) return;

        const currentData = [...selectedInstance.data];

        switch (actionLabel) {
            case 'Append':
            case 'Push':
            case 'Enqueue':
            case 'Push Right':
                // Initialize new elements with "0"
                if (actionLabel === 'Push Right' || actionLabel === 'Enqueue') {
                    currentData.push('0');
                } else {
                    currentData.push('0');
                }
                updateInstance(selectedInstance.id, { data: currentData });
                break;

            case 'Push Left':
                // Initialize new elements with "0"
                currentData.unshift('0');
                updateInstance(selectedInstance.id, { data: currentData });
                break;

            case 'Pop':
            case 'Pop Right':
                if (currentData.length > 0) {
                    currentData.pop();
                    updateInstance(selectedInstance.id, { data: currentData });
                }
                break;

            case 'Pop Left':
            case 'Dequeue':
                if (currentData.length > 0) {
                    currentData.shift();
                    updateInstance(selectedInstance.id, { data: currentData });
                }
                break;

            case 'Insert At':
                const index = prompt('Enter index to insert at:');
                if (index !== null) {
                    const idx = parseInt(index);
                    if (!isNaN(idx) && idx >= 0 && idx <= currentData.length) {
                        currentData.splice(idx, 0, '0'); // Initialize with "0"
                        updateInstance(selectedInstance.id, {
                            data: currentData,
                        });
                    }
                }
                break;

            case 'Find':
                const searchValue = prompt('Enter value to find:');
                if (searchValue !== null) {
                    const index = currentData.indexOf(searchValue.trim());
                    if (index !== -1) {
                        alert(`Value "${searchValue}" found at index ${index}`);
                    } else {
                        alert(`Value "${searchValue}" not found`);
                    }
                }
                break;

            case 'Peek':
            case 'Front':
                if (currentData.length > 0) {
                    const frontValue =
                        selectedInstance.type === 'stack'
                            ? currentData[currentData.length - 1]
                            : currentData[0];
                    alert(`Front/Top value: ${frontValue}`);
                } else {
                    alert(`${selectedInstance.type} is empty`);
                }
                break;
        }
    };

    return (
        <div
            className={`bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-700 ${
                isExpanded ? 'w-80' : 'w-16'
            }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 hover:bg-gray-800 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
            >
                {isExpanded ? (
                    <FiChevronLeft className="w-6 h-6" />
                ) : (
                    <FiChevronRight className="w-6 h-6" />
                )}
            </button>

            {/* Toolbar Content */}
            {isExpanded && (
                <div className="flex flex-col p-4 space-y-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white">
                        Data Structure Playground
                    </h3>

                    {/* Data Structure Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Data Structure
                        </label>
                        {selectedInstance ? (
                            // Show selected instance type (read-only)
                            <div className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white">
                                {getDataStructureLabel(selectedInstance.type)}
                            </div>
                        ) : (
                            // Show dropdown for new instances
                            <select
                                value={selectedDataStructure}
                                onChange={(e) =>
                                    setSelectedDataStructure(
                                        e.target.value as DataStructure,
                                    )
                                }
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {dataStructureOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {selectedInstance && (
                            <p className="text-xs text-gray-400">
                                Working with: {selectedInstance.name}
                            </p>
                        )}
                    </div>

                    {/* Data Structure Actions */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">
                            Actions
                        </h4>
                        <div className="space-y-2">
                            {getDataStructureActions().map((action, index) => {
                                const IconComponent = action.icon;
                                const isDisabled =
                                    !selectedInstance &&
                                    action.label !== 'Find';
                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleDataStructureAction(
                                                action.label,
                                            )
                                        }
                                        className={`flex items-center space-x-2 p-2 rounded transition-colors w-full ${
                                            isDisabled
                                                ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                                                : action.color
                                        }`}
                                        disabled={isDisabled}
                                        title={
                                            isDisabled
                                                ? 'Select a data structure instance first'
                                                : ''
                                        }
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span className="text-sm">
                                            {action.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Variables */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-300">
                                Variables
                            </h4>
                            <button
                                onClick={addCustomVariable}
                                className="p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                                title="Add Variable"
                            >
                                <FiPlus className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {customVariables.map((variable) => (
                                <div
                                    key={variable.id}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="text"
                                        value={variable.name}
                                        className="flex-1 p-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        value={variable.value}
                                        onChange={(e) =>
                                            updateVariableValue(
                                                variable.id,
                                                e.target.value,
                                            )
                                        }
                                        className="w-16 p-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                    <button
                                        onClick={() =>
                                            removeVariable(variable.id)
                                        }
                                        className="p-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
                                        title="Remove"
                                    >
                                        <FiTrash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Utility Actions */}
                    <div className="space-y-2 border-t border-gray-600 pt-4">
                        <h4 className="text-sm font-medium text-gray-300">
                            Utilities
                        </h4>
                        <div className="space-y-2">
                            <button className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors w-full">
                                <FiRotateCcw className="w-4 h-4" />
                                <span className="text-sm">Reset</span>
                            </button>
                            <button className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors w-full">
                                <FiEdit3 className="w-4 h-4" />
                                <span className="text-sm">Export Code</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
