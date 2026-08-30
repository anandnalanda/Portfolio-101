import type { Metadata } from "next";
import StapleChatScreen from "@/components/screens/staple-chat/StapleChatScreen";

export const metadata: Metadata = {
  title: "Staple Chat Playground",
  description: "A demo screen of the Staple Chat data-analysis interface.",
};

export default function StapleChatPlaygroundPage() {
  // The screen fills its parent (height: 100%), so give it a full-viewport box.
  return (
    <div style={{ height: "100dvh" }}>
      <StapleChatScreen />
    </div>
  );
}
