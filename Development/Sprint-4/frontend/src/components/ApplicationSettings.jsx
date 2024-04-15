import React from "react";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function ApplicationSettings() {
  const {
    data: initialData,
    error,
    isLoading,
  } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/application`,
    fetcher
  );

  const [data, setData] = useState(null); // this will have data from config for a specific setting
  const [msg, setMsg] = useState(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setData(initialData?.data);
  }, [initialData]);

  const updateSettings = async (event) => {
    event.preventDefault();
    try {
      const req = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
        },
        body: JSON.stringify({
          setting_name: "application",
          value: {
            name: data.name,
            url: data.url,
          },
        }),
      });
      const res = await req.json();
      if (res.error) {
        setMsg("Failed to update settings");
      } else {
        setMsg("Settings updated successfully");
      }

      mutate(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/application`);
    } catch (error) {
      console.log(error);
      setMsg("Failed to update settings");
    }
  };

  useEffect(() => {
  }, [data, error, isLoading]);

  return (
    <>
      <h1 className="text-2xl font-semibold"> Application</h1>
      <div className="max-w-4xl mx-auto p-6 bg-[#1f1f1f] rounded-lg shadow mt-10">
        {!isLoading && data ? (
          <form>
            <div className="mb-4">
            <h2 className="text-m text-white mb-5 mt-4">
              Enter your Application settings
            </h2>
              <p className="text-sm font-medium text-white">{msg}</p>
              <label
                htmlFor="application-name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Application Name *
              </label>
              <input
                type="text"
                id="application-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Acme"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="application-url"
                className="block mt-6 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Application URL *
              </label>
              <input
                type="url"
                id="application-url"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://test.pocketbase.io/"
                required
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={updateSettings}
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save changes
              </button>
            </div>
          </form>
        ) : (
          <div className=" text-black">Loading...</div>
        )}
      </div>
    </>
  );
}
