'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type DataStructure =
    | 'array'
    | 'stack'
    | 'queue'
    | 'deque'
    | 'linkedlist'
    | 'doublylinkedlist';

export interface DataStructureInstance {
    id: string;
    type: DataStructure;
    name: string;
    position: { x: number; y: number };
    data: any[];
}

interface DataStructureContextType {
    selectedDataStructure: DataStructure;
    setSelectedDataStructure: (type: DataStructure) => void;
    instances: DataStructureInstance[];
    addInstance: (instance: Omit<DataStructureInstance, 'id'>) => void;
    updateInstance: (
        id: string,
        updates: Partial<DataStructureInstance>,
    ) => void;
    removeInstance: (id: string) => void;
    selectedInstance: DataStructureInstance | null;
    setSelectedInstance: (instance: DataStructureInstance | null) => void;
}

const DataStructureContext = createContext<
    DataStructureContextType | undefined
>(undefined);

export function DataStructureProvider({ children }: { children: ReactNode }) {
    const [selectedDataStructure, setSelectedDataStructure] =
        useState<DataStructure>('array');
    const [instances, setInstances] = useState<DataStructureInstance[]>([]);
    const [selectedInstance, setSelectedInstance] =
        useState<DataStructureInstance | null>(null);

    const addInstance = (instance: Omit<DataStructureInstance, 'id'>) => {
        const newInstance: DataStructureInstance = {
            ...instance,
            id: Date.now().toString(),
        };
        setInstances((prev) => [...prev, newInstance]);
    };

    const updateInstance = (
        id: string,
        updates: Partial<DataStructureInstance>,
    ) => {
        setInstances((prev) =>
            prev.map((instance) =>
                instance.id === id ? { ...instance, ...updates } : instance,
            ),
        );
        // Update selected instance if it's the one being updated
        if (selectedInstance?.id === id) {
            setSelectedInstance({ ...selectedInstance, ...updates });
        }
    };

    const removeInstance = (id: string) => {
        setInstances((prev) => prev.filter((instance) => instance.id !== id));
        // Clear selection if the removed instance was selected
        if (selectedInstance?.id === id) {
            setSelectedInstance(null);
        }
    };

    return (
        <DataStructureContext.Provider
            value={{
                selectedDataStructure,
                setSelectedDataStructure,
                instances,
                addInstance,
                updateInstance,
                removeInstance,
                selectedInstance,
                setSelectedInstance,
            }}
        >
            {children}
        </DataStructureContext.Provider>
    );
}

export function useDataStructure() {
    const context = useContext(DataStructureContext);
    if (context === undefined) {
        throw new Error(
            'useDataStructure must be used within a DataStructureProvider',
        );
    }
    return context;
}
