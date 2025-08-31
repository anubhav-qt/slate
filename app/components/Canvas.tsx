'use client';

import { useState, useRef, useEffect } from 'react';
import { useDataStructure } from '../context/DataStructureContext';
import { FiX, FiEdit3, FiTrash2 } from 'react-icons/fi';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    dataStructureType: string;
    position: { x: number; y: number };
}

function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    dataStructureType,
    position,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Add {dataStructureType}?
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-300 mb-6">
                    Do you want to add a new {dataStructureType.toLowerCase()}{' '}
                    at this position?
                </p>
                <div className="flex space-x-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

interface DataStructureVisualizationProps {
    instance: any;
    isSelected: boolean;
    onSelect: () => void;
    onUpdateName: (newName: string) => void;
    onUpdateData: (newData: any[]) => void;
    onDelete: () => void;
    onDrag: (deltaX: number, deltaY: number) => void;
}

function DataStructureVisualization({
    instance,
    isSelected,
    onSelect,
    onUpdateName,
    onUpdateData,
    onDelete,
    onDrag,
}: DataStructureVisualizationProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(instance.name);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempValue, setTempValue] = useState('');
    const dragRef = useRef<HTMLDivElement>(null);

    const handleNameEdit = () => {
        setIsEditingName(true);
        setTempName(instance.name);
    };

    const handleNameSave = () => {
        if (tempName.trim()) {
            onUpdateName(tempName.trim());
        }
        setIsEditingName(false);
    };

    const handleNameCancel = () => {
        setTempName(instance.name);
        setIsEditingName(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (
            e.target === dragRef.current ||
            (e.target as HTMLElement).closest('.drag-handle')
        ) {
            const rect = dragRef.current?.getBoundingClientRect();
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
                setIsDragging(true);
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    // Global mouse move handler
    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging && dragRef.current) {
            const canvas = dragRef.current.parentElement;
            if (canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                const newX = Math.max(
                    0,
                    e.clientX - canvasRect.left - dragOffset.x,
                );
                const newY = Math.max(
                    0,
                    e.clientY - canvasRect.top - dragOffset.y,
                );

                onDrag(newX - instance.position.x, newY - instance.position.y);
            }
        }
    };

    // Global mouse up handler
    const handleGlobalMouseUp = () => {
        setIsDragging(false);
    };

    // Effect to handle global mouse events during drag
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, dragOffset, instance.position]);

    const handleElementEdit = (index: number) => {
        setEditingIndex(index);
        setTempValue(instance.data[index].toString());
    };

    const handleElementSave = (index: number) => {
        const newData = [...instance.data];
        newData[index] = tempValue.trim() || '0';
        onUpdateData(newData);
        setEditingIndex(null);
        setTempValue('');
    };

    const handleElementCancel = () => {
        setEditingIndex(null);
        setTempValue('');
    };

    const EditableElement = ({
        value,
        index,
        className,
        onClick,
    }: {
        value: any;
        index: number;
        className: string;
        onClick?: () => void;
    }) => {
        if (editingIndex === index) {
            return (
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={() => handleElementSave(index)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') handleElementSave(index);
                        if (e.key === 'Escape') handleElementCancel();
                    }}
                    className={`${className} bg-black border-2 border-blue-400 focus:outline-none text-center text-white`}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }

        return (
            <div
                className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all`}
                onClick={(e) => {
                    e.stopPropagation();
                    handleElementEdit(index);
                    onClick?.();
                }}
                title="Click to edit"
            >
                {value}
            </div>
        );
    };

    const renderDataStructure = () => {
        const { type, data } = instance;

        switch (type) {
            case 'array':
                return (
                    <div className="flex items-center space-x-1 mt-2">
                        {data.length === 0 ? (
                            <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded flex items-center justify-center text-gray-400 text-xs">
                                Empty
                            </div>
                        ) : (
                            data.map((item: any, index: number) => (
                                <EditableElement
                                    key={index}
                                    value={item}
                                    index={index}
                                    className="w-12 h-12 border-2 border-blue-400 bg-gray-700 rounded flex items-center justify-center text-white font-medium text-sm"
                                />
                            ))
                        )}
                        <div className="text-xs text-gray-400 ml-2">
                            [{data.length}]
                        </div>
                    </div>
                );

            case 'stack':
                return (
                    <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 mt-2">
                        {data.length === 0 ? (
                            <div className="w-16 h-12 border-2 border-dashed border-gray-500 rounded flex items-center justify-center text-gray-400 text-xs">
                                Empty
                            </div>
                        ) : (
                            data.map((item: any, index: number) => (
                                <EditableElement
                                    key={index}
                                    value={item}
                                    index={index}
                                    className={`w-16 h-10 border-2 ${
                                        index === data.length - 1
                                            ? 'border-green-400 bg-green-800 text-white'
                                            : 'border-gray-500 bg-gray-700 text-white'
                                    } rounded flex items-center justify-center font-medium text-sm`}
                                />
                            ))
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                            Top ↑ | Size: {data.length}
                        </div>
                    </div>
                );

            case 'queue':
                return (
                    <div className="mt-2">
                        <div className="flex items-center space-x-1">
                            {data.length === 0 ? (
                                <div className="w-16 h-12 border-2 border-dashed border-gray-500 rounded flex items-center justify-center text-gray-400 text-xs">
                                    Empty
                                </div>
                            ) : (
                                data.map((item: any, index: number) => (
                                    <EditableElement
                                        key={index}
                                        value={item}
                                        index={index}
                                        className={`w-12 h-12 border-2 ${
                                            index === 0
                                                ? 'border-red-400 bg-red-800 text-white'
                                                : index === data.length - 1
                                                ? 'border-green-400 bg-green-800 text-white'
                                                : 'border-gray-500 bg-gray-700 text-white'
                                        } rounded flex items-center justify-center font-medium text-sm`}
                                    />
                                ))
                            )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex justify-between">
                            <span>← Front</span>
                            <span>Rear →</span>
                        </div>
                    </div>
                );

            case 'deque':
                return (
                    <div className="mt-2">
                        <div className="flex items-center space-x-1">
                            {data.length === 0 ? (
                                <div className="w-16 h-12 border-2 border-dashed border-gray-500 rounded flex items-center justify-center text-gray-400 text-xs">
                                    Empty
                                </div>
                            ) : (
                                data.map((item: any, index: number) => (
                                    <EditableElement
                                        key={index}
                                        value={item}
                                        index={index}
                                        className={`w-12 h-12 border-2 ${
                                            index === 0 ||
                                            index === data.length - 1
                                                ? 'border-purple-400 bg-purple-800 text-white'
                                                : 'border-gray-500 bg-gray-700 text-white'
                                        } rounded flex items-center justify-center font-medium text-sm`}
                                    />
                                ))
                            )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex justify-between">
                            <span>← Left</span>
                            <span>Right →</span>
                        </div>
                    </div>
                );

            case 'linkedlist':
                return (
                    <div className="mt-2">
                        {/* Head Pointer */}
                        <div className="flex items-center mb-3">
                            <div className="flex items-center">
                                <div className="w-10 h-6 bg-yellow-600 border border-yellow-500 rounded text-xs text-white flex items-center justify-center font-medium">
                                    HEAD
                                </div>
                                <div className="w-4 h-0.5 bg-yellow-500 ml-1"></div>
                                <div className="w-0 h-0 border-l-4 border-l-yellow-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                            </div>
                            {data.length === 0 && (
                                <div className="ml-2 w-6 h-6 border-2 border-gray-500 bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-gray-400">
                                        ∅
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Linked List Nodes */}
                        <div className="flex items-center space-x-1">
                            {data.length === 0 ? (
                                <div className="text-xs text-gray-400 ml-16">
                                    Empty list - HEAD points to NULL
                                </div>
                            ) : (
                                data.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        {/* Node with data and next pointer */}
                                        <div className="flex border-2 border-blue-400 rounded overflow-hidden bg-gray-700">
                                            {/* Data part */}
                                            <EditableElement
                                                value={item}
                                                index={index}
                                                className="w-12 h-12 bg-gray-700 text-white font-medium text-sm flex items-center justify-center border-r border-blue-400"
                                            />
                                            {/* Next pointer part */}
                                            <div className="w-8 h-12 bg-gray-600 text-white text-xs flex items-center justify-center border-blue-400">
                                                {index < data.length - 1 ? (
                                                    <span className="text-blue-300">
                                                        →
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        ∅
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Connection line to next node */}
                                        {index < data.length - 1 && (
                                            <div className="flex items-center mx-1">
                                                <div className="w-4 h-0.5 bg-blue-400"></div>
                                                <div className="w-0 h-0 border-l-4 border-l-blue-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            Each node: [Data|Next] | Size: {data.length}
                        </div>
                    </div>
                );

            case 'doublylinkedlist':
                return (
                    <div className="mt-2">
                        {/* Head Pointer */}
                        <div className="flex items-center mb-3">
                            <div className="flex items-center">
                                <div className="w-10 h-6 bg-yellow-600 border border-yellow-500 rounded text-xs text-white flex items-center justify-center font-medium">
                                    HEAD
                                </div>
                                <div className="w-4 h-0.5 bg-yellow-500 ml-1"></div>
                                <div className="w-0 h-0 border-l-4 border-l-yellow-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                            </div>
                            {data.length === 0 && (
                                <div className="ml-2 w-6 h-6 border-2 border-gray-500 bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-gray-400">
                                        ∅
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Doubly Linked List Nodes */}
                        <div className="flex items-center space-x-1">
                            {data.length === 0 ? (
                                <div className="text-xs text-gray-400 ml-16">
                                    Empty list - HEAD points to NULL
                                </div>
                            ) : (
                                data.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        {/* Node with prev, data, and next pointer */}
                                        <div className="flex border-2 border-purple-400 rounded overflow-hidden bg-gray-700">
                                            {/* Prev pointer part */}
                                            <div className="w-6 h-12 bg-gray-600 text-white text-xs flex items-center justify-center border-r border-purple-400">
                                                {index > 0 ? (
                                                    <span className="text-purple-300">
                                                        ←
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        ∅
                                                    </span>
                                                )}
                                            </div>
                                            {/* Data part */}
                                            <EditableElement
                                                value={item}
                                                index={index}
                                                className="w-12 h-12 bg-gray-700 text-white font-medium text-sm flex items-center justify-center border-r border-purple-400"
                                            />
                                            {/* Next pointer part */}
                                            <div className="w-6 h-12 bg-gray-600 text-white text-xs flex items-center justify-center border-purple-400">
                                                {index < data.length - 1 ? (
                                                    <span className="text-purple-300">
                                                        →
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        ∅
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bidirectional connection lines to next node */}
                                        {index < data.length - 1 && (
                                            <div className="flex flex-col items-center mx-1">
                                                {/* Forward arrow */}
                                                <div className="flex items-center mb-0.5">
                                                    <div className="w-3 h-0.5 bg-purple-400"></div>
                                                    <div className="w-0 h-0 border-l-3 border-l-purple-400 border-t-1 border-b-1 border-t-transparent border-b-transparent"></div>
                                                </div>
                                                {/* Backward arrow */}
                                                <div className="flex items-center">
                                                    <div className="w-0 h-0 border-r-3 border-r-purple-400 border-t-1 border-b-1 border-t-transparent border-b-transparent"></div>
                                                    <div className="w-3 h-0.5 bg-purple-400"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            Each node: [Prev|Data|Next] | Size: {data.length}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-sm text-white mt-2">
                        {data.length === 0 ? (
                            <span className="italic">Empty {type}</span>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {data.map((item: any, index: number) => (
                                    <EditableElement
                                        key={index}
                                        value={item}
                                        index={index}
                                        className="bg-gray-700 px-2 py-1 rounded text-white"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div
            ref={dragRef}
            className={`absolute border-2 rounded-lg p-4 bg-gray-800 shadow-md transition-all duration-200 ${
                isSelected
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-600 hover:border-gray-500'
            } ${
                isDragging
                    ? 'cursor-grabbing shadow-2xl scale-105 z-50'
                    : 'cursor-default'
            }`}
            style={{
                left: instance.position.x,
                top: instance.position.y,
                minWidth:
                    instance.type === 'linkedlist'
                        ? '400px'
                        : instance.type === 'doublylinkedlist'
                        ? '500px'
                        : '200px',
                minHeight: '120px',
                transition: isDragging ? 'none' : 'all 0.2s ease',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Header with name and controls */}
            <div className="flex items-center justify-between mb-2 drag-handle cursor-grab hover:cursor-grab">
                <div className="flex items-center space-x-2">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={handleNameSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNameSave();
                                if (e.key === 'Escape') handleNameCancel();
                            }}
                            className="font-semibold text-white bg-transparent border-b border-blue-400 focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <h3
                            className="font-semibold text-white cursor-pointer hover:text-blue-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNameEdit();
                            }}
                        >
                            {instance.name}
                        </h3>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNameEdit();
                        }}
                        className="text-gray-400 hover:text-blue-400 p-1"
                        title="Edit name"
                    >
                        <FiEdit3 className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-white">
                        {instance.type.charAt(0).toUpperCase() +
                            instance.type.slice(1)}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Delete"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>{' '}
            {/* Data Structure Visualization */}
            {renderDataStructure()}
        </div>
    );
}

export default function Canvas() {
    const {
        selectedDataStructure,
        instances,
        addInstance,
        updateInstance,
        removeInstance,
        selectedInstance,
        setSelectedInstance,
    } = useDataStructure();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        position: { x: number; y: number };
    }>({
        isOpen: false,
        position: { x: 0, y: 0 },
    });

    // Canvas panning state
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [mouseDownTime, setMouseDownTime] = useState(0);
    const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    const [currentCursor, setCurrentCursor] = useState<
        'default' | 'add' | 'grab' | 'grabbing'
    >('default');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const LONG_PRESS_THRESHOLD = 200; // ms
    const MOVE_THRESHOLD = 5; // pixels

    // Cursor class mapping
    const getCursorClass = (cursor: typeof currentCursor) => {
        switch (cursor) {
            case 'add':
                return 'cursor-crosshair';
            case 'grab':
                return 'cursor-grab';
            case 'grabbing':
                return 'cursor-grabbing';
            default:
                return 'cursor-default';
        }
    };

    // Custom cursor style for add mode
    const getCustomCursorStyle = (cursor: typeof currentCursor) => {
        if (cursor === 'add') {
            return {
                cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'><circle cx='12' cy='12' r='10' fill='%23ffffff'/><path d='m9 12 6 0'/><path d='m12 9 0 6'/></svg>") 12 12, crosshair`,
            };
        }
        return {};
    };

    // Function to check if mouse is over any data structure
    const isMouseOverInstance = (
        clientX: number,
        clientY: number,
        canvasElement: HTMLElement,
    ) => {
        const rect = canvasElement.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        return instances.some((instance) => {
            const width =
                instance.type === 'linkedlist'
                    ? 400
                    : instance.type === 'doublylinkedlist'
                    ? 500
                    : 200;
            const instanceRect = {
                left: instance.position.x + canvasOffset.x,
                top: instance.position.y + canvasOffset.y,
                right: instance.position.x + canvasOffset.x + width,
                bottom: instance.position.y + canvasOffset.y + 120,
            };
            return (
                x >= instanceRect.left &&
                x <= instanceRect.right &&
                y >= instanceRect.top &&
                y <= instanceRect.bottom
            );
        });
    };

    // Function to check if mouse is over a draggable area of a data structure
    const isMouseOverDraggableArea = (
        clientX: number,
        clientY: number,
        canvasElement: HTMLElement,
    ) => {
        const rect = canvasElement.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        return instances.some((instance) => {
            const width =
                instance.type === 'linkedlist'
                    ? 400
                    : instance.type === 'doublylinkedlist'
                    ? 500
                    : 200;

            // Check if mouse is in the header area (first ~40 pixels of height - where drag-handle is)
            const headerHeight = 40;
            const instanceRect = {
                left: instance.position.x + canvasOffset.x,
                top: instance.position.y + canvasOffset.y,
                right: instance.position.x + canvasOffset.x + width,
                bottom: instance.position.y + canvasOffset.y + headerHeight,
            };
            return (
                x >= instanceRect.left &&
                x <= instanceRect.right &&
                y >= instanceRect.top &&
                y <= instanceRect.bottom
            );
        });
    };

    // Update cursor based on mouse position and state
    const updateCursor = (
        clientX: number,
        clientY: number,
        canvasElement: HTMLElement,
    ) => {
        if (isPanning) {
            setCurrentCursor('grabbing');
        } else if (isMouseOverDraggableArea(clientX, clientY, canvasElement)) {
            setCurrentCursor('grab');
        } else if (isMouseOverInstance(clientX, clientY, canvasElement)) {
            setCurrentCursor('default');
        } else {
            setCurrentCursor('add');
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click is on an existing instance
        const clickedInstance = instances.find((instance) => {
            const width =
                instance.type === 'linkedlist'
                    ? 400
                    : instance.type === 'doublylinkedlist'
                    ? 500
                    : 200;
            const instanceRect = {
                left: instance.position.x + canvasOffset.x,
                top: instance.position.y + canvasOffset.y,
                right: instance.position.x + canvasOffset.x + width,
                bottom: instance.position.y + canvasOffset.y + 120,
            };
            return (
                x >= instanceRect.left &&
                x <= instanceRect.right &&
                y >= instanceRect.top &&
                y <= instanceRect.bottom
            );
        });

        if (!clickedInstance) {
            // Clicked on empty space - prepare for potential pan or modal
            setMouseDownTime(Date.now());
            setMouseDownPos({ x: e.clientX, y: e.clientY });
            setHasMoved(false);
            setPanStart({
                x: e.clientX - canvasOffset.x,
                y: e.clientY - canvasOffset.y,
            });
            setSelectedInstance(null);
            setCurrentCursor('grab');
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Update cursor based on current position
        updateCursor(e.clientX, e.clientY, e.currentTarget);

        if (mouseDownTime > 0) {
            const deltaX = e.clientX - mouseDownPos.x;
            const deltaY = e.clientY - mouseDownPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > MOVE_THRESHOLD) {
                setHasMoved(true);

                // Check if we should start panning
                const timeSinceMouseDown = Date.now() - mouseDownTime;
                if (timeSinceMouseDown > LONG_PRESS_THRESHOLD || isPanning) {
                    setIsPanning(true);
                    setCurrentCursor('grabbing');
                    setCanvasOffset({
                        x: e.clientX - panStart.x,
                        y: e.clientY - panStart.y,
                    });
                }
            }
        }
    };

    const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        const wasMouseDown = mouseDownTime > 0;
        const timeSinceMouseDown = Date.now() - mouseDownTime;

        setMouseDownTime(0);
        setIsPanning(false);

        // Update cursor after releasing
        updateCursor(e.clientX, e.clientY, e.currentTarget);

        // Only open modal if it was a simple click (short press with minimal movement)
        if (
            wasMouseDown &&
            !hasMoved &&
            timeSinceMouseDown < LONG_PRESS_THRESHOLD
        ) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - canvasOffset.x;
            const y = e.clientY - rect.top - canvasOffset.y;

            setModalState({
                isOpen: true,
                position: { x, y },
            });
        }
    };

    const handleCanvasMouseLeave = () => {
        setMouseDownTime(0);
        setIsPanning(false);
        setCurrentCursor('default');
    };

    // Effect to prevent text selection during panning
    useEffect(() => {
        if (isPanning) {
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.userSelect = '';
        }

        return () => {
            document.body.style.userSelect = '';
        };
    }, [isPanning]);

    // Initialize cursor on mount
    useEffect(() => {
        setCurrentCursor('add');
    }, []);

    const handleConfirmAdd = () => {
        const instanceName = `${selectedDataStructure}_${instances.length + 1}`;

        addInstance({
            type: selectedDataStructure,
            name: instanceName,
            position: modalState.position,
            data: [],
        });

        setModalState({ isOpen: false, position: { x: 0, y: 0 } });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, position: { x: 0, y: 0 } });
    };

    const handleUpdateName = (instanceId: string, newName: string) => {
        updateInstance(instanceId, { name: newName });
    };

    const handleUpdateData = (instanceId: string, newData: any[]) => {
        updateInstance(instanceId, { data: newData });
    };

    const handleDeleteInstance = (instanceId: string) => {
        removeInstance(instanceId);
    };

    const handleDragInstance = (
        instanceId: string,
        deltaX: number,
        deltaY: number,
    ) => {
        const instance = instances.find((inst) => inst.id === instanceId);
        if (instance) {
            const newX = Math.max(0, instance.position.x + deltaX);
            const newY = Math.max(0, instance.position.y + deltaY);
            updateInstance(instanceId, {
                position: { x: newX, y: newY },
            });
        }
    };

    const getDataStructureLabel = (type: string) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="flex-1 bg-black relative overflow-hidden">
            {/* Canvas Header */}
            <div className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-white">
                        Data Structure Visualization
                    </h1>
                    <div className="flex items-center space-x-4">
                        {selectedInstance && (
                            <span className="text-sm text-blue-400 font-medium">
                                Selected: {selectedInstance.name} (
                                {getDataStructureLabel(selectedInstance.type)})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="absolute inset-0 pt-20 p-4">
                <div
                    className={`w-full h-full bg-gray-900 rounded-lg shadow-sm border border-gray-700 relative overflow-hidden ${getCursorClass(
                        currentCursor,
                    )}`}
                    style={getCustomCursorStyle(currentCursor)}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseLeave}
                >
                    {/* Canvas Grid Background */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px',
                            transform: `translate(${canvasOffset.x % 20}px, ${
                                canvasOffset.y % 20
                            }px)`,
                        }}
                    />

                    {/* Data Structure Instances */}
                    <div
                        style={{
                            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                            transition: isPanning
                                ? 'none'
                                : 'transform 0.2s ease',
                            opacity: isPanning ? 0.8 : 1,
                        }}
                    >
                        {instances.map((instance) => (
                            <DataStructureVisualization
                                key={instance.id}
                                instance={instance}
                                isSelected={
                                    selectedInstance?.id === instance.id
                                }
                                onSelect={() => setSelectedInstance(instance)}
                                onUpdateName={(newName) =>
                                    handleUpdateName(instance.id, newName)
                                }
                                onUpdateData={(newData) =>
                                    handleUpdateData(instance.id, newData)
                                }
                                onDelete={() =>
                                    handleDeleteInstance(instance.id)
                                }
                                onDrag={(deltaX, deltaY) =>
                                    handleDragInstance(
                                        instance.id,
                                        deltaX,
                                        deltaY,
                                    )
                                }
                            />
                        ))}
                    </div>

                    {/* Empty Canvas Message */}
                    {instances.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-gray-400 text-center">
                                <p className="text-lg">
                                    ➕ Click anywhere to add a data structure
                                </p>
                                <p className="text-sm mt-2">
                                    Select a data structure type from the
                                    toolbar first
                                </p>
                                <p className="text-xs mt-3 opacity-70">
                                    💡 Hold and drag to pan the canvas
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Panning Indicator */}
                    {isPanning && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium pointer-events-none z-50">
                            🖐️ Panning Canvas
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAdd}
                dataStructureType={getDataStructureLabel(selectedDataStructure)}
                position={modalState.position}
            />
        </div>
    );
}
