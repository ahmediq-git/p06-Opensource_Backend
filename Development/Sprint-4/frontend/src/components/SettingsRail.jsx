import React from 'react'
import { BarChart3} from "lucide-react";

export default function SettingsRail({ setActiveSetting,activeSetting }) {

  return (
    <aside className="w-64 px-4 py-5 bg-gray-1  border-r-2 border-[#2D2D2D]">

    <nav className="space-y-1">
      <p className="text-sm font-semibold uppercase mb-2">System</p>
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'application' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('application')}
      >
        <AppWindowIcon className="mr-3 h-6 w-6 " />
        Application{"\n              "}
      </a>
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'mail' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('mail')}
      >
        <MailIcon className="mr-3 h-6 w-6 " />
        Mail settings{"\n              "}
      </a>
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'file' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('file')}
      >
        <FileIcon className="mr-3 h-6 w-6 " />
        Files storage{"\n              "}
      </a>
      {/* <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'backup' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('backup')}
      >
        <DatabaseBackupIcon className="mr-3 h-6 w-6 " />
        Backups{"\n              "}
      </a> */}
      <p className="mt-4 text-sm font-semibold uppercase">Sync</p>
      {/* <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'export' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('export')}
      >
        <ImportIcon className="mr-3 h-6 w-6 " />
        Export collections{"\n              "}
      </a> */}
      {/* <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'import' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('import')}
      >
        <ImportIcon className="mr-3 h-6 w-6 " />
        Import collections{"\n              "}
      </a> */}
      
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'logs' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('logs')}
      >
        <BarChart3 className="mr-3 h-6 w-6 " />
        Logs{"\n              "}
      </a>
      
      <p className="mt-4 text-sm font-semibold uppercase">Authentication</p>
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'provider' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('oauth')}
      >
        <LogInIcon className="mr-3 h-6 w-6 " />
        Auth providers{"\n              "}
      </a>
      {/* <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'token' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('token')}
      >
        <TicketIcon className="mr-3 h-6 w-6 " />
        Token options{"\n              "}
      </a> */}
      <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSetting === 'admins' ? 'bg-zinc-600' : ''} hover:bg-zinc-600  hover:text-gray-100`}
        
        onClick={() => setActiveSetting('admins')}
      >
        <UsersIcon className="mr-3 h-6 w-6 " />
        Admins{"\n              "}
      </a>
    </nav>
  </aside>
  )
}

function AppWindowIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 4v4" />
        <path d="M2 8h20" />
        <path d="M6 4v4" />
      </svg>
    )
  }
  
  
  function DatabaseBackupIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 12a9 3 0 0 0 5 2.69" />
        <path d="M21 9.3V5" />
        <path d="M3 5v14a9 3 0 0 0 6.47 2.88" />
        <path d="M12 12v4h4" />
        <path d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" />
      </svg>
    )
  }
  
  
  function FileIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    )
  }
  
  
  function ImportIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
        <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
      </svg>
    )
  }
  
  
  function LogInIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" x2="3" y1="12" y2="12" />
      </svg>
    )
  }
  
  
  function MailIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  }
  
  
  function TicketIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
    )
  }
  
  
  function UsersIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }