

const AgentBrainDiagram = () => {
    return (
        <div className="w-full mt-12 bg-[#f5f5f0] font-sans flex justify-center items-start text-gray-800 rounded-[40px] border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-full bg-[#fdfdfc] overflow-hidden flex flex-col pt-8">

                {/* TOP SECTION: The Architecture Diagram */}
                <div className="relative w-full border-b border-gray-300 bg-white overflow-x-auto custom-scrollbar pb-8">
                    {/* Main Diagram Container (Fixed aspect ratio to preserve exact layout) */}
                    <div
                        className="relative min-w-[1350px] h-[550px] mx-auto transform scale-95 md:scale-100 origin-top"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    >
                        {/* --- SVG OVERLAY FOR LINES AND ARROWS --- */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                            <defs>
                                <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                                </marker>
                                <marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                                </marker>
                                <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                </marker>
                            </defs>

                            {/* Blueprint Dimension Lines */}
                            <g stroke="#9ca3af" strokeWidth="1" opacity="0.6">
                                {/* Left of Code */}
                                <line x1="20" y1="50" x2="20" y2="470" />
                                <line x1="15" y1="50" x2="25" y2="50" />
                                <line x1="15" y1="470" x2="25" y2="470" />
                                <text x="10" y="260" transform="rotate(-90 10 260)" fontSize="10" fill="#6b7280" textAnchor="middle" letterSpacing="1">19.0</text>

                                {/* Top of Code */}
                                <line x1="40" y1="30" x2="380" y2="30" />
                                <line x1="40" y1="25" x2="40" y2="35" />
                                <line x1="380" y1="25" x2="380" y2="35" />

                                {/* Top Gap */}
                                <line x1="390" y1="30" x2="460" y2="30" />
                                <line x1="390" y1="25" x2="390" y2="35" />
                                <line x1="460" y1="25" x2="460" y2="35" />
                                <text x="425" y="25" fontSize="10" fill="#6b7280" textAnchor="middle">6.3</text>

                                {/* Top of Graph */}
                                <line x1="660" y1="30" x2="1280" y2="30" />
                                <line x1="660" y1="25" x2="660" y2="35" />
                                <line x1="1280" y1="25" x2="1280" y2="35" />
                                <text x="970" y="25" fontSize="10" fill="#6b7280" textAnchor="middle" letterSpacing="1">28.0</text>

                                {/* Right of Graph */}
                                <line x1="1280" y1="50" x2="1280" y2="470" />
                                <line x1="1275" y1="50" x2="1285" y2="50" />
                                <line x1="1275" y1="470" x2="1285" y2="470" />
                                <text x="1292" y="260" transform="rotate(-90 1292 260)" fontSize="10" fill="#6b7280" textAnchor="middle" letterSpacing="1">15.5</text>
                            </g>

                            {/* Flowing Lines from Code to Parser */}
                            <g fill="none" strokeWidth="2">
                                <path d="M 380 120 C 430 120, 440 235, 480 235" stroke="#3b82f6" markerEnd="url(#arrow-blue)" />
                                <path d="M 380 142 C 430 142, 440 245, 480 245" stroke="#3b82f6" markerEnd="url(#arrow-blue)" />
                                <path d="M 380 162 C 430 162, 440 255, 480 255" stroke="#3b82f6" markerEnd="url(#arrow-blue)" />
                                <path d="M 380 183 C 430 183, 440 265, 480 265" stroke="#f97316" markerEnd="url(#arrow-orange)" />
                                <path d="M 380 205 C 430 205, 440 275, 480 275" stroke="#3b82f6" markerEnd="url(#arrow-blue)" />
                                <path d="M 380 305 C 430 305, 440 285, 480 285" stroke="#f97316" markerEnd="url(#arrow-orange)" />
                                <path d="M 380 325 C 430 325, 440 295, 480 295" stroke="#f97316" markerEnd="url(#arrow-orange)" />
                                <path d="M 380 370 C 430 370, 440 305, 480 305" stroke="#3b82f6" markerEnd="url(#arrow-blue)" />
                            </g>

                            {/* Parser Output Arrow */}
                            <path d="M 580 270 L 640 270 L 640 265 L 655 275 L 640 285 L 640 280 L 580 280 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                            <path d="M 585 275 L 645 275" stroke="#3b82f6" strokeWidth="2" fill="none" />

                            {/* Internal Graph Connections (Orthogonal Manhattan style) */}
                            <g fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" opacity="0.8">
                                {/* From CREATE to branch point */}
                                <path d="M 765 275 H 785" />
                                {/* Main vertical bus */}
                                <path d="M 785 100 V 380" />

                                {/* Branches from bus to Col 2 */}
                                <path d="M 785 100 H 810" markerEnd="url(#arrow-blue)" />
                                <path d="M 785 190 H 810" markerEnd="url(#arrow-blue)" />
                                <path d="M 785 380 H 810" markerEnd="url(#arrow-blue)" />

                                {/* AST NODE to CALL */}
                                <path d="M 945 100 H 965 V 140 H 985" markerEnd="url(#arrow-blue)" />

                                {/* LOOP to CONDITION */}
                                <path d="M 945 190 H 965 V 230 H 985" markerEnd="url(#arrow-blue)" />

                                {/* CONDITION branches */}
                                <path d="M 1125 230 H 1140 V 210 H 1160" stroke="#f97316" markerEnd="url(#arrow-orange)" /> {/* To EDGE */}
                                <path d="M 1125 230 H 1140 V 300 H 985" stroke="#3b82f6" markerEnd="url(#arrow-blue)" /> {/* Back to LOG */}

                                {/* CALL to CREATE GraphRAG */}
                                <path d="M 1125 140 H 1160" markerEnd="url(#arrow-blue)" />

                                {/* CREATE GraphRAG down to EDGE and to RETURN */}
                                <path d="M 1290 140 H 1310 V 275 H 1160" markerEnd="url(#arrow-blue)" /> {/* Wrap around to return */}

                                {/* CHECK to SAVE */}
                                <path d="M 945 380 H 1160" stroke="#f97316" markerEnd="url(#arrow-orange)" />

                                {/* SAVE and EDGE looping back to main bus */}
                                <path d="M 1160 380 H 1145 V 430 H 770 V 380" stroke="#f97316" markerEnd="url(#arrow-orange)" />
                                <path d="M 1290 210 H 1300 V 440 H 760 V 275" markerEnd="url(#arrow-blue)" />

                                {/* Final branch to RETURN */}
                                <path d="M 785 275 H 1285" markerEnd="url(#arrow-green)" stroke="#10b981" />
                            </g>

                            {/* Decorative Graph Nodes box wrapper lines */}
                            <rect x="650" y="50" width="650" height="420" fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" />
                        </svg>

                        {/* --- HTML ELEMENTS OVERLAY --- */}

                        {/* Sub-label for Graph */}
                        <div className="absolute top-[480px] left-[650px] w-[650px] text-center text-xs font-bold text-gray-600 tracking-wider">
                            STRUCTURED NODE GRAPH (KNOWLEDGE REPRESENTATION)
                        </div>
                        {/* Sub-label for Code */}
                        <div className="absolute top-[480px] left-[40px] w-[340px] text-center text-xs font-bold text-gray-600 tracking-wider">
                            RAW CODE INPUT
                        </div>

                        {/* Graph Stats Text */}
                        <div className="absolute top-[60px] left-[660px] text-[10px] leading-tight text-gray-500 font-mono">
                            NODE COUNT: 10<br />
                            DEPTH: 4<br />
                            GRAPH TYPE: DAG
                        </div>

                        {/* 1. Raw Code Input Box */}
                        <div className="absolute top-[50px] left-[40px] w-[340px] h-[420px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-800 p-5 font-mono text-[13px] leading-relaxed z-20 overflow-hidden">
                            <div className="text-[#d4d4d4]">
                                <span className="text-[#c678dd]">function</span> <span className="text-[#61afef]">processData</span>(input) {'{'}<br />
                                &nbsp;&nbsp;<span className="text-[#c678dd]">const</span> ast = <span className="text-[#61afef]">parse</span>(input);<br />
                                &nbsp;&nbsp;<span className="text-[#c678dd]">let</span> result = <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">GraphRAG</span>();<br />
                                &nbsp;&nbsp;<span className="text-[#c678dd]">for</span> (<span className="text-[#c678dd]">let</span> node <span className="text-[#c678dd]">in</span> ast.nodes) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">if</span> (node.type === <span className="text-[#98c379]">'function_call'</span>) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result.<span className="text-[#61afef]">addEdge</span>(node.name, node.args);<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#6a9955]">// Focus on AST structure</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.<span className="text-[#61afef]">log</span>(<span className="text-[#98c379]">'Processing '</span> + node.name);<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#6a9955]">// Local persistence check</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">if</span> (node.<span className="text-[#61afef]">isLocal</span>()) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#61afef]">saveToDisk</span>(node);<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                                &nbsp;&nbsp;{'}'}<br />
                                &nbsp;&nbsp;<span className="text-[#c678dd]">return</span> result.<span className="text-[#61afef]">optimize</span>();<br />
                                {'}'}
                            </div>
                        </div>

                        {/* 2. Parser Icon Area */}
                        <div className="absolute top-[210px] left-[480px] w-[100px] flex flex-col items-center z-20 bg-[#fdfdfc]/80 backdrop-blur-sm p-2 rounded-lg">
                            <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="mb-2">
                                <path d="M 5 10 L 55 10 L 40 40 L 40 70 L 20 70 L 20 40 Z" stroke="#374151" strokeWidth="2" fill="white" />
                                {/* Horizontal internal lines for parsing visualization */}
                                <line x1="12" y1="18" x2="48" y2="18" stroke="#374151" strokeWidth="1.5" />
                                <line x1="18" y1="26" x2="42" y2="26" stroke="#374151" strokeWidth="1.5" />
                                <line x1="25" y1="34" x2="35" y2="34" stroke="#374151" strokeWidth="1.5" />
                                {/* Abstract syntax nodes around it */}
                                <circle cx="5" cy="40" r="3" fill="#3b82f6" />
                                <circle cx="15" cy="55" r="3" fill="#f97316" />
                                <circle cx="50" cy="50" r="3" fill="#10b981" />
                                <path d="M 5 40 L 15 55 L 50 50" stroke="#d1d5db" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                            </svg>
                            <div className="text-[9px] font-bold text-center text-gray-800 leading-tight">
                                SYNTAX PARSING &<br />TRANSFORMATION
                            </div>
                        </div>

                        {/* 3. Graph Nodes */}
                        <NodeBox x={650} y={250} title="CREATE:" val="result processData" type="blue" />

                        {/* Column 2 */}
                        <NodeBox x={815} y={80} title="AST NODE:" val="function processData" type="blue" />
                        <NodeBox x={815} y={170} title="LOOP:" val="for (node)" type="blue" />
                        <NodeBox x={815} y={360} title="CHECK:" val="node.isLocal()" type="blue" />

                        {/* Column 3 */}
                        <NodeBox x={990} y={120} title="CALL:" val="parse(input)" type="blue" />
                        <NodeBox x={990} y={210} title="CONDITION:" val={'if (node.type === "function_call")'} type="orange" width={140} />
                        <NodeBox x={990} y={280} title="LOG:" val="console.log" type="blue" />

                        {/* Column 4 */}
                        <NodeBox x={1165} y={120} title="CREATE:" val="new GraphRAG()" type="green_check" />
                        <NodeBox x={1165} y={190} title="EDGE:" val="addEdge" type="blue" />
                        <NodeBox x={1165} y={360} title="SAVE:" val="saveToDisk" type="orange_alert" />

                        {/* Column 5 */}
                        <NodeBox x={1290} y={250} title="RETURN:" val="result.optimize()" type="green_check" />

                    </div>
                </div>

                {/* BOTTOM SECTION: Title & Features */}
                <div className="p-8 md:p-12 bg-white">
                    <div className="border-t-[3px] border-gray-900 w-full mb-8"></div>

                    <h4 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-2 uppercase m-0">
                        AGENT BRAIN
                    </h4>
                    <p className="text-xl md:text-2xl font-normal text-gray-700 mb-12 tracking-tight m-0">
                        The Cognitive Engine for AI Coding Agents
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pt-8 border-t border-gray-100">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-5">
                            <div className="mt-1 flex-shrink-0">
                                {/* Hierarchy Icon */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="3" width="6" height="6" rx="1" />
                                    <path d="M12 9v3" />
                                    <path d="M5 12h14" />
                                    <path d="M5 12v3" />
                                    <path d="M19 12v3" />
                                    <rect x="2" y="15" width="6" height="6" rx="1" />
                                    <rect x="16" y="15" width="6" height="6" rx="1" />
                                    <rect x="9" y="15" width="6" height="6" rx="1" />
                                </svg>
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-900 mb-2 m-0 tracking-tight">AST-Aware Context</h5>
                                <p className="text-gray-600 leading-snug m-0 text-sm">
                                    Ingestion that treats code as syntax trees, not text.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-5">
                            <div className="mt-1 flex-shrink-0">
                                {/* Search/Nodes Icon */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <circle cx="11" cy="11" r="3" fill="#f97316" fillOpacity="0.2" />
                                    <circle cx="6" cy="11" r="1.5" />
                                    <circle cx="16" cy="11" r="1.5" />
                                    <circle cx="11" cy="6" r="1.5" />
                                    <circle cx="11" cy="16" r="1.5" />
                                    <path d="M6 11h10M11 6v10" strokeWidth="1" strokeDasharray="2 2" />
                                </svg>
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-900 mb-2 m-0 tracking-tight">Multi-Modal Search</h5>
                                <p className="text-gray-600 leading-snug m-0 text-sm">
                                    5 distinct retrieval modes including GraphRAG.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start gap-5">
                            <div className="mt-1 flex-shrink-0">
                                {/* Server/Local Icon */}
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                    <line x1="2" y1="16" x2="22" y2="16" />
                                    <line x1="6" y1="7" x2="6.01" y2="7" strokeWidth="3" />
                                    <line x1="6" y1="13" x2="6.01" y2="13" strokeWidth="3" />
                                    <line x1="6" y1="19" x2="6.01" y2="19" strokeWidth="3" />
                                </svg>
                            </div>
                            <div>
                                <h5 className="text-lg font-bold text-gray-900 mb-2 m-0 tracking-tight">Local-First Architecture</h5>
                                <p className="text-gray-600 leading-snug m-0 text-sm">
                                    Per-project isolation with disk persistence.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af; 
        }
      `}</style>
        </div>
    );
};

// Reusable Sub-component for Graph Nodes
const NodeBox = ({ x, y, title, val, type, width = 130 }: { x: number, y: number, title: string, val: string, type: 'blue' | 'orange' | 'green' | 'green_check' | 'orange_alert', width?: number }) => {
    let borderColor = "border-[#3b82f6]";
    let titleColor = "text-[#3b82f6]";

    if (type === 'orange' || type === 'orange_alert') {
        borderColor = "border-[#f97316]";
        titleColor = "text-[#f97316]";
    } else if (type === 'green' || type === 'green_check') {
        borderColor = "border-[#10b981]";
        titleColor = "text-[#10b981]";
    }

    return (
        <div
            className={`absolute bg-white border-2 rounded-md shadow-sm flex flex-col justify-center p-2 z-20 ${borderColor}`}
            style={{ left: x, top: y, width: width, transform: 'translateY(-50%)' }}
        >
            <div className={`text-[9px] font-bold ${titleColor} mb-0.5 tracking-wide m-0 leading-none`}>{title}</div>
            <div className="text-[11px] font-medium text-gray-800 leading-tight font-mono whitespace-nowrap overflow-hidden text-ellipsis m-0">
                {val}
            </div>

            {/* Optional Icons inside nodes based on type */}
            {type === 'green_check' && (
                <div className="absolute -top-2 -right-2 bg-[#10b981] text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            )}
            {type === 'orange_alert' && (
                <div className="absolute -top-2 -right-2 bg-[#f97316] text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm font-bold text-[10px]">
                    !
                </div>
            )}

            {/* Node attachment points (visual only) */}
            <div className="absolute left-[-4px] top-1/2 w-2 h-2 rounded-full bg-white border border-gray-300 transform -translate-y-1/2"></div>
            <div className="absolute right-[-4px] top-1/2 w-2 h-2 rounded-full bg-white border border-gray-300 transform -translate-y-1/2"></div>
        </div>
    );
};

export default AgentBrainDiagram;
