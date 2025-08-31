import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import ChatBox from './components/Code';
import { DataStructureProvider } from './context/DataStructureContext';

export default function Page() {
    return (
        <DataStructureProvider>
            <div className="flex h-screen bg-black">
                {/* Left Toolbar */}
                <Toolbar />

                {/* Main Canvas Area */}
                <Canvas />

                {/* Right Chat Box */}
                <ChatBox />
            </div>
        </DataStructureProvider>
    );
}
