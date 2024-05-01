import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function LogSettings() {
  const {
    data: initialData,
    error,
    isLoading,
  } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/logs`,
    fetcher
  );

  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setData(initialData?.data);
  }, [initialData]);

  const updateSettings = async (event) => {
    event.preventDefault();
    // if (!fieldCheck()) {
    //   setMsg("Please fill all fields");
    //   return;
    // }
    // should be whole number
    if (data.retention % 1!== 0 || data.retention < 0) {
      setMsg("Number of days must be a whole number");
      return;
    }
    try {
      const req = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
        },
        body: JSON.stringify({
          setting_name: "logs",
          value: {
            retention: Number(data.retention),
          },
        }),
      });
      const res = await req.json();
      if (res.error) {
        setMsg("Failed to update settings");
      } else {
        setMsg("Settings updated successfully");
      }

      mutate(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/logs`);
    } catch (error) {
      console.log(error);
      setMsg("Failed to update settings");
    }

  }

  return (
    <>
      <h1 className="text-2xl font-semibold"> Log Settings </h1>
      <div className="mb-4"></div>
      <div className="max-w-4xl mx-auto p-6 bg-[#1f1f1f] rounded-lg shadow">
        <div className="mt-4">
          <div className="mb-6">
            <h2 className="text-m text-white">
              Enter the number of days to retain logs.
            </h2>
            <div className="mb-4"></div>
            <p className="text-sm font-medium text-white">{msg}</p>
  

          </div>
            <>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="serverhost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Retention Days</label>
                  <input
                    type="number"
                    value={data?.retention}
                    onChange={(e) => setData({ ...data, retention: +e.target.value })}
                    id="serverhost"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                
              </div>


              <div className="flex justify-end space-x-2">
                {/* <button
                  id='cancel-btn'
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Cancel
                </button> */}
                <button
                  id='save-btn'
                  type="button"
                  onClick={updateSettings}
                  // disabled={!data?.host ||!data?.port ||!data?.username ||!data?.password}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </>
          {/* )} */}
          <div className="grid justify-items-end space-x-2">

          </div>
        </div>

      </div>
    </>
  )
}