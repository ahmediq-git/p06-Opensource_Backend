import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../lib/utils/fetcher";

export default function MailSettings() {
  // State to store the switch state
  // const [isSwitchOn, setIsSwitchOn] = useState(false);

  // // Function to handle switch toggle
  // const handleSwitchToggle = (event) => {
  //   setIsSwitchOn(event.target.checked);
  // };

  // function to hide the sendtestemail-btn when the switch is on
  // useEffect(() => {
  //   if (isSwitchOn) {
  //     document.getElementById('sendtestemail-btn').style.display = 'none';
  //   } else {
  //     document.getElementById('sendtestemail-btn').style.display = 'block';
  //   }
  // }
  // );
  const {
    data: initialData,
    error,
    isLoading,
  } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/smtp`,
    fetcher
  );

  const [data, setData] = useState({
    username: '',
    password: '',
    host: 0,
    port: '',
  });
  const [msg, setMsg] = useState(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setData(initialData?.data);
  }, [initialData]);

  const updateSettings = async (event) => {
    event.preventDefault();
    if (!fieldCheck()) {
      setMsg("Please fill all fields");
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
          setting_name: "smtp",
          value: {
            username: data.username,
            password: data.password,
            host: data.host,
            port: Number(data.port),
          },
        }),
      });
      const res = await req.json();
      if (res.error) {
        setMsg("Failed to update settings");
      } else {
        setMsg("Settings updated successfully");
      }

      mutate(`${import.meta.env.VITE_BACKEND_URL}/admin_ui/settings/smtp`);
    } catch (error) {
      console.log(error);
      setMsg("Failed to update settings");
    }
    function fieldCheck () {
      return (
        data.host !== '' &&
        data.port !== '' &&
        data.username !== '' &&
        data.password !== ''
      );
    };
  }

  return (
    <>
      <h1 className="text-2xl font-semibold"> Mail Settings </h1>
      <div className="mb-4"></div>
      <div className="max-w-4xl mx-auto p-6 bg-[#1f1f1f] rounded-lg shadow">
        <div className="mt-4">
          <div className="mb-6">
            <h2 className="text-m text-white">
              Configure common settings for sending emails.
            </h2>
            <div className="mb-4"></div>
            <p className="text-sm font-medium text-white">{msg}</p>
            {/* <div className="grid grid-cols-2 gap-4 mb-4">

              <div className="flex flex-col">
                <label htmlFor="sendername" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sender Name*</label>
                <input
                  type="text"
                  id="sendername"
                  placeholder='Support'
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="senderaddr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sender Address*</label>
                <input
                  type="text"
                  id="senderaddr"
                  placeholder='support@example.com'
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div> */}

          </div>
          {/* <div className="flex items-center space-x-2 mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={handleSwitchToggle}
              />
              <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`} />
            </label>
            <label htmlFor="use-s3-storage">Use SMTP mail server (recommended)</label>
          </div> */}
          {/* {isSwitchOn && ( */}
            <>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="serverhost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SMTP server host*</label>
                  <input
                    type="text"
                    value={data?.host}
                    onChange={(e) => setData({ ...data, host: e.target.value })}
                    id="serverhost"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="port" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Port*</label>
                  <input
                    type="number"
                    id="port"
                    value={data?.port}
                    onChange={(e) => setData({ ...data, port: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username*</label>
                  <input
                    type="text"
                    id="username"
                    value={data?.username}
                    onChange={(e) => setData({ ...data, username: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password*</label>
                  <input
                    type="text"
                    id="password"
                    value={data?.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
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
            {/* <button
              id='sendtestemail-btn'
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Send Test Email
            </button> */}
          </div>
        </div>

      </div>
    </>
  )
}

