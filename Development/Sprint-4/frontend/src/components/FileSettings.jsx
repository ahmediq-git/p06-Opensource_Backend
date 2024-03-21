import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function FileSettings() {

  const {
    data: initialData,
    error,
    isLoading,
  } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/blobStorage`,
    fetcher
  );

  const [data, setData] = useState({
    useBlobStorage: false,
    serviceName: "",
    serviceKey: "",
    storageConnectionString: "",
    containerName: "",
    region: "",
    sas: "",
  });
  const [msg, setMsg] = useState(null);
  const { mutate } = useSWRConfig();
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    if (initialData && initialData.data) {
      setData(initialData.data);
      setIsSwitchOn(initialData.data.useBlobStorage);
    }
  }, [initialData]);

  const updateFileSettings = async (event) => {
    event.preventDefault();
    try {
      const req = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "blobStorage/json",
        },
        body: JSON.stringify({
          setting_name: "blobStorage",
          value: {
            useBlobStorage: data.useBlobStorage,
            serviceName: data.serviceName,
            serviceKey: data.serviceKey,
            storageConnectionString: data.storageConnectionString,
            containerName: data.containerName,
            region: data.region,
            sas: data.sas,
          },
        }),
      });
      const res = await req.json();
      if (res.error) {
        setMsg("Failed to update file storage settings");
      } else {
        setMsg("File storage settings updated successfully");
      }

      mutate(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/blobStorage`);
    } catch (error) {
      console.log(error);
      setMsg("Failed to update file storage settings");
    }
  };

  const resetFileSettings = () => {
    setData({
      useBlobStorage: true,
      serviceName: "",
      serviceKey: "",
      storageConnectionString: "",
      containerName: "",
      region: "",
      sas: "",
    });
  };

  const handleSwitchToggle = (event) => {
    setIsSwitchOn(event.target.checked);
  };

  useEffect(() => {
    console.log("data", data);
    console.log("error", error);
    console.log("isLoading", isLoading);
  }, [data, error, isLoading]);

  return (
    <>
      <h1 className="text-2xl font-semibold"> File Storage </h1>
      <div className="mb-4"></div>
      <div className="max-w-4xl mx-auto p-6 bg-[#1f1f1f] rounded-lg shadow">
        <div className="mt-4">
          <div className="mb-6">
            <p className="text-sm text-white">
              By default EzBase uses the local file system to store uploaded files.
              <br />
              If you have limited disk space, you could optionally connect to an Azure Blob Storage.
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={(e) => setData({ ...data, useBlobStorage: e.target.checked })}
                onInput={updateFileSettings}
                checked={data.useBlobStorage}
              />
              <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`} />
            </label>
            <label htmlFor="use-blob-storage">Use Blob storage</label>
          </div>
          {(data.useBlobStorage && (!isLoading || (isLoading && !initialData))) ? (
            <form>
              <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6">
                <p className="text-sm font-medium text-gray-700">{msg}</p>
                <p className="text-sm">
                  If you have existing uploaded files, you'll have to migrate them manually from the local file system to the
                  Blob storage. There are numerous command line tools that can help you, such as: rclone, s5cmd, etc.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="serviceName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Storage Account Name*</label>
                  <input
                    type="text"
                    id="serviceName"
                    value={data.serviceName || ""}
                    onChange={(e) => setData({ ...data, serviceName: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="serviceKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Key*</label>
                  <input
                    type="text"
                    id="serviceKey"
                    value={data.serviceKey || ""}
                    onChange={(e) => setData({ ...data, serviceKey: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="storageConnectionString" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Connection String*</label>
                  <input
                    type="text"
                    id="storageConnectionString"
                    value={data.storageConnectionString || ""}
                    onChange={(e) => setData({ ...data, storageConnectionString: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="containerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Container Name*</label>
                  <input
                    type="text"
                    id="containerName"
                    value={data.containerName || ""}
                    onChange={(e) => setData({ ...data, containerName: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Region*</label>
                  <input
                    type="text"
                    id="region"
                    value={data.region || ""}
                    onChange={(e) => setData({ ...data, region: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sas" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SAS*</label>
                  <input
                    type="text"
                    id="sas"
                    value={data.sas || ""}
                    onChange={(e) => setData({ ...data, sas: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              {/* <div className="flex items-center space-x-2 mb-6">
                <input
                  id="force-path-style"
                  type="checkbox"
                  value=""
                  checked={data.forcePath || false}
                  onChange={(e) => setData({ ...data, forcePath: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="force-path-style" className="ms-2 text-sm font-medium text-white">
                  Force path-style addressing
                </label>
              </div> */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetFileSettings}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Reset
                </button>
                <button
                  id='save-btn'
                  type="button"
                  onClick={updateFileSettings}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            (data.useBlobStorage && !isLoading && initialData) ? (
              <div className=" text-white">Loading...</div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
