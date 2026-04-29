import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditVoiceForm from "@/features/voices/my-voices/voice-details/edit-voice.form";
import SampleManager from "@/features/voices/my-voices/voice-details/sample-manager";
import { VoiceT } from "@/services/voices/types";

interface VoiceDetailsTabProps {
  voice?: VoiceT;
}
const VoiceDetailsTab = ({ voice }: VoiceDetailsTabProps) => {
  return (
    <Tabs defaultValue="settings">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="samples">Samples</TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="mt-6 max-w-md">
        <EditVoiceForm voice={voice} />
      </TabsContent>

      <TabsContent value="samples" className="mt-6 max-w-lg">
        <SampleManager voiceId={voice?.id as string} />
      </TabsContent>
    </Tabs>
  );
};

export default VoiceDetailsTab;
