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
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [feedbackType, setFeedbackType] = useState<
        'success' | 'error' | 'info'
    >('info');

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
        { value: 'linkedlist', label: 'Linked List' },
        { value: 'doublylinkedlist', label: 'Doubly Linked List' },
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
            case 'linkedlist':
                return [
                    {
                        icon: FiArrowRight,
                        label: 'Append',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiArrowLeft,
                        label: 'Prepend',
                        color: 'bg-blue-500 hover:bg-blue-600',
                    },
                    {
                        icon: FiPlus,
                        label: 'Insert At',
                        color: 'bg-green-600 hover:bg-green-700',
                    },
                    {
                        icon: FiMinus,
                        label: 'Delete At',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiSearch,
                        label: 'Find',
                        color: 'bg-purple-600 hover:bg-purple-700',
                    },
                ];
            case 'doublylinkedlist':
                return [
                    {
                        icon: FiArrowRight,
                        label: 'Append',
                        color: 'bg-blue-600 hover:bg-blue-700',
                    },
                    {
                        icon: FiArrowLeft,
                        label: 'Prepend',
                        color: 'bg-blue-500 hover:bg-blue-600',
                    },
                    {
                        icon: FiPlus,
                        label: 'Insert At',
                        color: 'bg-green-600 hover:bg-green-700',
                    },
                    {
                        icon: FiMinus,
                        label: 'Delete At',
                        color: 'bg-red-600 hover:bg-red-700',
                    },
                    {
                        icon: FiSearch,
                        label: 'Find',
                        color: 'bg-purple-600 hover:bg-purple-700',
                    },
                    {
                        icon: FiRotateCcw,
                        label: 'Reverse',
                        color: 'bg-orange-600 hover:bg-orange-700',
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
        const variableCount = customVariables.length + 1;
        const defaultName = `var${variableCount}`;
        const newVariable: CustomVariable = {
            id: Date.now().toString(),
            name: defaultName,
            value: '0',
        };
        setCustomVariables([...customVariables, newVariable]);
    };

    const updateVariableName = (id: string, name: string) => {
        setCustomVariables((prev) =>
            prev.map((variable) =>
                variable.id === id ? { ...variable, name } : variable,
            ),
        );
    };

    const showFeedback = (
        message: string,
        type: 'success' | 'error' | 'info' = 'info',
    ) => {
        setFeedbackMessage(message);
        setFeedbackType(type);
        setTimeout(() => setFeedbackMessage(''), 3000);
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
                showFeedback(`${actionLabel}ed element "0"`, 'success');
                break;

            case 'Push Left':
            case 'Prepend':
                // Initialize new elements with "0"
                currentData.unshift('0');
                updateInstance(selectedInstance.id, { data: currentData });
                showFeedback(`${actionLabel}ed element "0"`, 'success');
                break;

            case 'Pop':
            case 'Pop Right':
                if (currentData.length > 0) {
                    const poppedValue = currentData.pop();
                    updateInstance(selectedInstance.id, { data: currentData });
                    showFeedback(
                        `${actionLabel}ped element "${poppedValue}"`,
                        'success',
                    );
                } else {
                    showFeedback(
                        'Nothing to pop - data structure is empty',
                        'error',
                    );
                }
                break;

            case 'Pop Left':
            case 'Dequeue':
                if (currentData.length > 0) {
                    const poppedValue = currentData.shift();
                    updateInstance(selectedInstance.id, { data: currentData });
                    showFeedback(
                        `${actionLabel}d element "${poppedValue}"`,
                        'success',
                    );
                } else {
                    showFeedback(
                        'Nothing to remove - data structure is empty',
                        'error',
                    );
                }
                break;

            case 'Insert At':
                // Insert at the middle or append if empty
                const insertIndex = Math.floor(currentData.length / 2);
                currentData.splice(insertIndex, 0, '0');
                updateInstance(selectedInstance.id, { data: currentData });
                showFeedback(
                    `Inserted element at index ${insertIndex}`,
                    'success',
                );
                break;

            case 'Delete At':
                // Delete from the middle or last element if available
                if (currentData.length > 0) {
                    const deleteIndex = Math.floor(currentData.length / 2);
                    const deletedValue = currentData[deleteIndex];
                    currentData.splice(deleteIndex, 1);
                    updateInstance(selectedInstance.id, { data: currentData });
                    showFeedback(
                        `Deleted "${deletedValue}" from index ${deleteIndex}`,
                        'success',
                    );
                } else {
                    showFeedback(
                        'Nothing to delete - data structure is empty',
                        'error',
                    );
                }
                break;

            case 'Find':
                // Find the first element or show message if empty
                if (currentData.length > 0) {
                    const searchValue = currentData[0];
                    showFeedback(
                        `First element: "${searchValue}" at index 0`,
                        'info',
                    );
                } else {
                    showFeedback(
                        'Data structure is empty - nothing to find',
                        'error',
                    );
                }
                break;

            case 'Reverse':
                if (selectedInstance.type === 'doublylinkedlist') {
                    currentData.reverse();
                    updateInstance(selectedInstance.id, { data: currentData });
                    showFeedback(
                        'Doubly linked list reversed successfully',
                        'success',
                    );
                }
                break;

            case 'Peek':
            case 'Front':
                if (currentData.length > 0) {
                    const frontValue =
                        selectedInstance.type === 'stack'
                            ? currentData[currentData.length - 1]
                            : currentData[0];
                    const position =
                        selectedInstance.type === 'stack' ? 'top' : 'front';
                    showFeedback(
                        `${
                            position.charAt(0).toUpperCase() + position.slice(1)
                        } value: "${frontValue}"`,
                        'info',
                    );
                } else {
                    showFeedback(`${selectedInstance.type} is empty`, 'error');
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
                                        onChange={(e) =>
                                            updateVariableName(
                                                variable.id,
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1 p-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Variable name"
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

                    {/* Feedback Messages */}
                    {feedbackMessage && (
                        <div
                            className={`p-3 rounded text-sm ${
                                feedbackType === 'success'
                                    ? 'bg-green-800 text-green-200 border border-green-600'
                                    : feedbackType === 'error'
                                    ? 'bg-red-800 text-red-200 border border-red-600'
                                    : 'bg-blue-800 text-blue-200 border border-blue-600'
                            }`}
                        >
                            {feedbackMessage}
                        </div>
                    )}

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
