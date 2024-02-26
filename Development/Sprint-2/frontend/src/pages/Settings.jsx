import { useState,useEffect } from "react";
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"
// import { CardContent, Card } from "@/components/ui/card"
import SettingsRail from "../components/SettingsRail";
import SideRail from "../components/SideRail";
import ApplicationSettings from "../components/ApplicationSettings";
import MailSettings from "../components/MailSettings";
import FilesStorageSettings from "../components/FileSettings";

export default function Settings() {
    const [activeSetting, setActiveSetting] = useState('application');
    const renderSettingComponent = () => {
        switch (activeSetting) {
          case 'application':
            return <ApplicationSettings />;
          case 'mail':
            return <MailSettings />;
          case 'files':
            return <FilesStorageSettings />;
          // ... case for other setting components
          default:
            return null;
        }
    }

  return (
    <div className="flex h-screen bg-gray-1">
     <SideRail/>
     <SettingsRail setActiveSetting={setActiveSetting} activeSetting={activeSetting} />
      <main className="flex-1">
        <div className="px-10 py-6">
          <div className="mt-6">
            {renderSettingComponent()}
            {/* <Card className="max-w-4xl mx-auto">
              <CardContent>
                <form>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="application-name">Application name *</Label>
                      <Input id="application-name" placeholder="Acme" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="application-url">Application URL *</Label>
                      <Input id="application-url" placeholder="https://test.pocketbase.io/" />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Switch id="hide-controls" />
                        <Label className="ml-2" htmlFor="hide-controls">
                          Hide collection create and edit controls
                        </Label>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button>Save changes</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  )
}


