import React, { useState, useEffect } from 'react';
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import Files from "../components/Files"
import { useAtom } from "jotai";
import SideRail from "../components/SideRail";
import { useSWRConfig } from "swr";
import File from "../components/File"


export default function FilesPage() {
    const [selection, setSelection] = useAtom(fileSelectionAtom);
    const [activeState, setActiveState] = useState('files');
    const { mutate } = useSWRConfig();

    return (
        <div className="flex bg-neutral-950 text-gray-50 h-screen max-h-screen overflow-y-scroll relative"> {/* Set relative positioning */}
            
            <SideRail setActiveState={setActiveState}/>
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>
   
            <div className="flex-1 relative">
                <div className="w-full h-screen flex flex-col">
            
                            <div className="p-4 text-2xl gap-2 flex justify-between w-full backdrop-blur-lg z-20 border-b border-gray-100 border-opacity-10">
                                <div className="flex gap-2 grow">
                                    <span className="text-gray-100 text-opacity-25">
                                        Files /
                                    </span>
                                    <span className="">{selection?.meta_data?.name}</span>
                                </div>
                    
                                <div className="divider divider-horizontal m-0"></div>
                            </div>

                            <div className="basis-full flex gap-2 overflow-y-scroll w-full grow">
                                {/* all docs for the collection */}
                                <Files />

                                <div className="w-[1px] h-full bg-gray-100 opacity-10"></div>

                                {/* selected document */}
                                {selection.meta_data ? (
                                    <File />
                                ) : (
                                    <div className="flex flex-col justify-center items-center gap-2 w-full h-full basis-3/4">
                                        <h2 className="text-2xl">No document selected</h2>
                                        <p className="text-gray-500">
                                            Select a document to view its data
                                        </p>
                                    </div>
                                )}
                            </div>
        
                
                </div>
            </div>
            
         
        </div>
    );
}   