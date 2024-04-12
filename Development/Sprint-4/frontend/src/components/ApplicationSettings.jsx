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
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        {!isLoading && data ? (
          <form>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">{msg}</p>
              <label
                htmlFor="application-name"
                className="block text-lg p-2 font-medium text-gray-700"
              >
                Application Name *
              </label>
              <input
                type="text"
                id="application-name"
                className="mt-1 block w-full px-3 py-2 bg-white border text-gray-700 border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Acme"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="application-url"
                className="block text-lg p-2 font-medium text-gray-700"
              >
                Application URL *
              </label>
              <input
                type="url"
                id="application-url"
                className="mt-1 block w-full px-3 py-2 bg-white border text-gray-700 border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
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
