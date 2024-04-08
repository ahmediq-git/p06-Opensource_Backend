import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import SideRail from '../components/SideRail';
// import ezbase from "./../../../sdk/dist/index";
import ezbase from 'ezbase-ts';

// const socket = io(`${import.meta.env.VITE_BACKEND_SOCKET_URL}`);

const RealtimeTest = () => {
  const [collections, setCollections] = useState([]);
  const [subscribedCollections, setSubscribedCollections] = useState([]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [realtimeService, setRealtimeService] = useState(null);
  const eb = new ezbase(`${import.meta.env.VITE_BACKEND_URL}`,`${import.meta.env.VITE_BACKEND_SOCKET_URL}`);

  useEffect(() => {
    // Initialize the RealtimeService
    const service = eb.rts;
    setRealtimeService(service);

    // Fetch collections from backend
    fetchCollections();

    return () => {
      // Cleanup: unsubscribe from all collections on unmount
      subscribedCollections.forEach((collection) => {
        service.unsubscribe(collection);
      });
    };
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collections`, {
        headers: {
          'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
        }
      });
      const data = await response.json();
      setCollections(data.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const updateCollectionData = (updateInfo) => {
    const { collection, record } = updateInfo;
    setMessage(`Collection ${collection} updated with new record: ${JSON.stringify(record)}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setMessage('');
    }, 5000); // Hide toast after 5 seconds
  };

  const removeRecordFromCollection = (updateInfo) => {
    const { collection_name, record } = updateInfo;
    setMessage(`Record removed from Collection ${collection_name}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setMessage('');
    }, 5000); // Hide toast after 5 seconds
  };

  const handleSubscribe = (collectionName) => {
    // Use the RealtimeService to subscribe
    realtimeService?.subscribe(collectionName,
      {}   //{"$and":[{"age":{"$gt":25}},{"male":true}]} query if we want to get records that match specific query leave empty for all records
      , (data) => {
        console.log("datataa", data)
        updateCollectionData(data);
        //  may want to distinguish between 'recordAdded' and 'recordRemoved' by adding another field in the data sent by the server
      });
    setSubscribedCollections((prev) => [...prev, collectionName]);
  };

  const handleUnsubscribe = (collectionName) => {
    // Use the RealtimeService to unsubscribe
    realtimeService?.unsubscribe(collectionName);
    setSubscribedCollections((prev) =>
      prev.filter((collection) => collection !== collectionName)
    );
  };

  return (
    <div className="flex bg-gray-900 text-gray-50 h-screen max-h-screen">
      <SideRail />
      <div className="flex flex-col justify-center items-center w-full">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">Realtime Data Updates</h1>
          <p className="mb-8 text-lg text-center">
            Subscribe to collections to receive realtime updates.
          </p>
          <div>
            <h2 className="text-xl font-bold mb-2">Collections</h2>
            <ul>
              {collections.map((collection) => (
                !subscribedCollections.includes(collection) && (
                  <li key={collection} className="flex items-center mb-4">
                    <span className="mr-2">{collection}</span>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
                      onClick={() => handleSubscribe(collection)}
                    >
                      Subscribe
                    </button>
                  </li>
                )
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mt-8 mb-2">Subscribed Collections</h2>
            <ul>
              {subscribedCollections.map((collection) => (
                <li key={collection} className="mb-4">
                  <span className="mr-2">{collection}</span>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                    onClick={() => handleUnsubscribe(collection)}
                  >
                    Unsubscribe
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {showToast && (
            <div className="fixed bottom-4 right-4 animate-fade-in bg-gray-800 text-white p-4 rounded-lg shadow-md z-50">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtimeTest;
