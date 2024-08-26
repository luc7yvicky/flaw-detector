export const exampleCode = `import SectionBusinessForever from "@/components/section-business-forever";
import SectionVideoDisplayer from "@/components/section-video-displayer";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-36 min-h-screen"
    // only background brightness is 0.5
      style={{ background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/bg.svg')", backgroundSize: "cover", backgroundPosition: "center"}}>
      <hgroup className="flex flex-col items-center py-16 gap-4 z-10">
        <Badge>Systemable</Badge>
        <h1 className="text-6xl font-bold">Build once, Business forever</h1>
        <p className="text-sm">
          We help businesses to grow and scale by providing them with the right
          tools and resources.
        </p>
      </hgroup>
      <div className="z-10 grid grid-cols-2 max-w-4xl mx-auto gap-4 my-24">
        <Card className="bg-transparent backdrop-blur-sm col-span-2">
          <CardHeader>
            <CardTitle>Analyze</CardTitle>
            <CardDescription>
              We analyze your business processes and provide you with the right ways to make sure your business is running smoothly.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Systemize</CardTitle>
            <CardDescription>
              We find the ways to systemize your business processes to make sure you are not wasting time on repetitive tasks.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-transparent backdrop-blur-sm">`;
