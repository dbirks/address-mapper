import type { RecordItem } from "../App"
import { Button } from "@/components/ui/button"
interface Props {
  records: RecordItem[]
}

export default function MapPage({ records }: Props) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Map</h1>
      <div className="h-72 flex items-center justify-center bg-gray-100 text-gray-500 rounded">
        Map placeholder with {records.length} pin(s)
      </div>
      <Button onClick={() => alert('Share feature coming soon')}>Share Map</Button>
    </div>
  )
}
