import React, { useState, useEffect } from 'react';
import { fileSelectionAtom } from "../lib/state/fileSelectionAtom";
import Files from "../components/Files"
import { useAtom } from "jotai";
import SideRail from "../components/SideRail";
import File from "../components/File"
import PieChartCard from '../components/PieChart';
import { CloudCog } from 'lucide-react';
import axios from 'axios'




export default function FilesPage() {
    const [selection, setSelection] = useAtom(fileSelectionAtom);
    const [activeState, setActiveState] = useState('files');

    const [totalSize, setTotalSize] = useState(0);
	
	const [data, setData] = useState([
	{ title: "Images", value: 30, color: "#ff6384" },
	{ title: "Documents", value: 20, color: "#36a2eb" },
	{ title: "Other", value: 50, color: "#ffce56" }])

    const [showPieChart, setShowPieChart] = useState(false);

    const togglePieChart = () => {
        setShowPieChart(!showPieChart);
    };

    const [filesData, setFilesData] = useState([]);


    useEffect(() => {
        const fetchFilesList = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/files/list`);
            // Set state with fetched data
            setFilesData(response.data);
          } catch (error) {
            // Handle errors
            console.error('Error fetching files list:', error);
          }
        };
    
        // Fetch at start
        fetchFilesList();
    
        // Fetch every 1 minute
        const interval = setInterval(fetchFilesList, 1000);
    
        // Cleanup function to clear interval
        return () => clearInterval(interval);
      }, []); // Empty dependency array ensures this effect runs only once on mount

    function analyzeMetadata(metadataList) {
        const getTotalSize = () => {
            return metadataList.reduce((total, item) => total + item.size, 0);
        };
    
        const countFileTypes = () => {
            let imageSize = 0;
            let documentSize = 0;
            let otherSize = 0;
            

            metadataList.forEach(item => {
                const filename = item.name;
              
                // Check if the content type indicates an image
                if (['jpg', 'jpeg', 'svg', 'png'].includes(getFileExtension(filename))) {
                    imageSize = imageSize +item.size;
                }
                // Check if the file extension indicates a document
                else if (['pdf', 'doc', 'docx', 'txt'].includes(getFileExtension(filename))) {
                    documentSize = documentSize + item.size;
                } else {
                    otherSize = otherSize + item.size;
                }
            });
    
            return { imageSize, documentSize, otherSize };
        };
    
        const getFileExtension = (filename) => {
            // Split the filename into its components and get the last part
            return filename.split('.').pop().toLowerCase();
        };
    
        const { imageSize, documentSize, otherSize } = countFileTypes();
        const totalSize = getTotalSize();
        
        return { imageSize, documentSize, otherSize, totalSize };
    }

    useEffect(() => {
        // console.log(fileData, error)
        if (filesData?.length !==0){
            
            const { imageSize, documentSize, otherSize, totalSize } = analyzeMetadata(filesData.data);
            
            setData([
                { title: "Images", value: parseFloat(((imageSize / totalSize) * 100).toFixed(2)), color: "#ff6384" },
                { title: "Documents", value: parseFloat(((documentSize / totalSize) * 100).toFixed(2)), color: "#36a2eb" },
                { title: "Other", value: parseFloat(((otherSize / totalSize) * 100).toFixed(2)), color: "#ffce56" }
            ]);
            setTotalSize(totalSize);
        } 

    }, [filesData]);


    return (
        <div className="flex bg-neutral-950 text-gray-50 h-screen max-h-screen overflow-y-scroll relative"> {/* Set relative positioning */}
            
            <SideRail setActiveState={setActiveState}/>
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>
   
            <div className="flex-1 relative">
                <div className="w-full h-screen flex flex-col">
            
                            <div className="p-4 text-2xl gap-2 flex justify-between w-full backdrop-blur-lg z-20 border-b border-gray-100 border-opacity-10">
                                <div className="flex gap-2 grow flex-row justify-between">
                                    <div>
                                    <span className="text-gray-100 text-opacity-25">
                                        Files /
                                    </span>
                                    <span className="">{selection?.meta_data?.name}</span>
                                    </div>
                                    <div>
                                    <button className="text-opacity-25" onClick={togglePieChart}>
                                        <CloudCog color="#36A2EB"/>
                                    </button>
                                    {showPieChart && (
                                            <div className="fixed top-10 right-2 flex justify-end items-start">
                                                <PieChartCard data={data} total={totalSize}/>
                                            </div>
                                        )}
                                    </div>
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
                                        <h2 className="text-2xl">No File selected</h2>
                                        <p className="text-gray-500">
                                            Select a File to view its data
                                        </p>
                                    </div>
                                )}
                            </div>
        
                
                </div>
            </div>
           
         
        </div>
    );
}   