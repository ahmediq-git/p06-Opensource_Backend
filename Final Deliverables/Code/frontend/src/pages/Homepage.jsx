import React, { useState, useEffect } from 'react';
import Collections from "../components/Collections";
import SideRail from "../components/SideRail";
import Documents from "../components/Documents";
import Document from "../components/Document";
import { Trash2 } from "lucide-react";
import { selectionAtom } from "../lib/state/selectionAtom";
import { useAtom } from "jotai";
import { useSWRConfig } from "swr";
import { isAuthCollection } from "../lib/utils/isAuthCollection";
import RealtimeTest from "./RealtimeTest";
import Bot from '../components/Bot';
import FunctionsPage from './Functions';
import Diagram from '../components/Diagram';

export default function HomePage() {

    const [selection, setSelection] = useAtom(selectionAtom);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showIndexModal, setShowIndexModal] = useState(false);
    const [indices, setIndices] = useState([]);
    const [indexField, setIndexField] = useState("");
    const [indexUnique, setIndexUnique] = useState(false);
    const [activeState, setActiveState] = useState('database');
    const [botOpen, setBotOpen] = useState(false);
    const { mutate } = useSWRConfig();

    useEffect(() => {
        // Fetch indices when the index modal is opened
        if (showIndexModal && selection.collection) {
            fetchIndices();
        }
    }, [showIndexModal]);

    const fetchIndices = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/index/get_all_indices_of_collection?collection_name=${selection.collection}`, {
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                }
            });
            const data = await res.json();
            setIndices(data.data); // Update state with fetched indices
        } catch (error) {
            console.log(error);
        }
    };

    const createIndex = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/index/create_index`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
                body: JSON.stringify({
                    collection_name: selection.collection,
                    field: indexField,
                    unique: false
                })
            });
            const data = await res.json();
            if (data.error == null) {
                // Index created successfully, update indices state
                alert("Index created")
                fetchIndices();
                setShowIndexModal(false);
            } else {
                alert(data.error)
            }
        } catch (error) {
            alert(error)
            console.log(error);
        }
    };

    const deleteIndex = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/index/remove_index`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
                body: JSON.stringify({
                    collection_name: selection.collection,
                    field: indexField,
                })
            });
            const data = await res.json();
            if (data.error == null) {
                // Index deleted successfully, update indices state
                alert("Index deleted")
                fetchIndices();
                setShowIndexModal(false);
            } else {
                alert("Error deleting index")
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCollection = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections/${selection.collection}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
                },
            });
            const data = await res.json();
            // remove the deleted collection from the list of collections
            setSelection({ collection: "", document: "" });
            mutate(`${import.meta.env.VITE_BACKEND_URL}/collections`);
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to toggle chat open/close
    const toggleChat = () => {
        setBotOpen((prev) => !prev);
    };

    return (
        <div className="flex bg-neutral-950 text-gray-50 h-screen max-h-screen overflow-y-visible relative"> {/* Set relative positioning */}
            {/* Bot circular button or chat interface */}
            <div className="absolute bottom-4 right-4 z-10"> {/* Set higher z-index */}
                {botOpen ? (
                    <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer mr-72 z-50" onClick={toggleChat}>
                        <span className="text-white">Close</span>
                    </div>
                ) : (
                    <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer" onClick={toggleChat}>
                        <span className="text-white">🤖</span>
                    </div>
                )}
            </div>

            {/* Bot chat interface */}
            {botOpen && (
                <div className="absolute bottom-4 right-4 z-20"> {/* Set higher z-index */}
                    <Bot className='.react-chatbot-kit-chat-message-container' />
                </div>
            )}

            {/* Rest of the page content */}
            <label
                className="hidden btn btn-primary"
                htmlFor="delete-collection-modal"
            >
                Open Modal
            </label>
            <input
                className="hidden modal-state"
                id="delete-collection-modal"
                type="checkbox"
                checked={showDeleteModal}
            />
            {/* Delete Modal */}
            <div className="modal modal-open overflow-y-scroll">
                <label
                    className="modal-overlay"
                    htmlFor="delete-collection-modal"
                ></label>
                <div
                    className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 "w-1/4  h-1/4"
                    `}
                >
                    <label
                        htmlFor="delete-collection-modal"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        ✕
                    </label>
                    <h2 className="text-xl">Delete collection</h2>

                    <div className="basis-full flex flex-col gap-2">
                        Are you sure you want to delete the collection{" "}
                        {selection.collection} ?
                        <p className="text-sm text-red-500 ">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="btn bg-red-500 hover:bg-red-600 btn-block"
                            onClick={deleteCollection}
                        >
                            Delete
                        </button>
                        {/* )} */}

                        <button
                            className="btn btn-block"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <label
                className="hidden btn btn-primary"
                htmlFor="index-modal"
            >
                Open Modal
            </label>
            <input
                className="hidden modal-state"
                id="index-modal"
                type="checkbox"
                checked={showIndexModal}
            />
            {/* Index Modal */}
            <div className="modal modal-open overflow-y-scroll">
                <label className="modal-overlay" htmlFor="index-modal"></label>
                <div className={`modal-content flex flex-col gap-5 max-w-6xl transition-all duration-500 "w-1/4  h-1/4"`}>
                    {indices.length > 0 && <div className='text-center font-semibold'>Existing indices</div>}
                    {indices.length > 0 && indices.map((index, indexKey) => (
                        <div key={indexKey} className="flex items-center justify-between border-b border-gray-300 py-2">
                            <div>
                                <div>On: {index.on}</div>
                                <div>Unique: {index.unique ? "Yes" : "No"}</div>
                            </div>
                            <button className="text-black bg-red-500 rounded p-1 mr-1 mt-2" onClick={() => deleteIndex(index)}>Delete</button>
                        </div>
                    ))}
                    <label htmlFor="index-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowIndexModal(false)}>✕</label>
                    <h2 className="text-xl text-center font-semibold">Create Index</h2>
                    <div className="flex flex-col gap-2">
                        <input type="text" className="input" placeholder="Field" value={indexField} onChange={(e) => setIndexField(e.target.value)} />
                        {/* <label>
                            <input type="checkbox" checked={indexUnique} onChange={(e) => setIndexUnique(e.target.checked)} />
                            Unique
                        </label> */}
                    </div>
                    <button className="btn bg-blue-500 hover:bg-blue-600 btn-block" onClick={createIndex}>Create</button>
                </div>

            </div>
            <SideRail setActiveState={setActiveState} />
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>
            {activeState == "database" && <Collections />}
            {activeState == "logs" && <Logs />}
            {activeState == "realtimedemo" && <RealtimeTest />}
            {activeState == "functions" && <FunctionsPage />}


            <div className="flex-1 relative">
                <div className="w-full h-screen flex flex-col">
                    {selection.collection ? (
                        <>
                            <div className="p-4 text-2xl gap-2 flex justify-between w-full backdrop-blur-lg z-20 border-b border-gray-100 border-opacity-10">
                                <div className="flex gap-2 grow">
                                    <span className="text-gray-100 text-opacity-25">
                                        Collections /
                                    </span>
                                    <span className="">{selection.collection}</span>
                                    <button className='button bg-blue-500 pl-2 pr-2 ml-4 text-base rounded' onClick={() => setShowIndexModal(true)}>Create index</button>
                                </div>
                                {selection.collection && !isAuthCollection(selection.collection) && (
                                    <div className="justify-self-end hover:scale-125 transition-all duration-150 cursor-pointer">
                                        <Trash2
                                            color="#e01b24"
                                            onClick={() => setShowDeleteModal(true)}
                                        />
                                    </div>
                                )}
                                <div className="divider divider-horizontal m-0"></div>
                            </div>

                            <div className="basis-full flex gap-2 overflow-y-scroll no-scrollbar w-full grow">
                                {/* all docs for the collection */}
                                <Documents />

                                <div className="w-[1px] h-full bg-gray-100 opacity-10"></div>

                                {/* selected document */}
                                {selection.document ? (
                                    <Document />
                                ) : (
                                    <div className="flex flex-col justify-center items-center gap-2 w-full h-full basis-3/4">
                                        <h2 className="text-2xl">No document selected</h2>
                                        <p className="text-gray-500">
                                            Select a document to view its data
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                            <h2 className="text-2xl">No collection selected</h2>
                            <p className="text-gray-500">
                                Select a collection to view its documents
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
