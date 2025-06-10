import type { RecordItem } from "../App"
import { Trash2 } from 'lucide-react'

interface Props {
  records: RecordItem[]
  onDelete: (id: string) => void
}

export default function ListPage({ records, onDelete }: Props) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Extracted Addresses</h1>
      {records.length === 0 && <p className="text-gray-500">No records yet.</p>}
      <ul className="space-y-2">
        {records.map((rec) => (
          <li key={rec.id} className="flex items-center gap-2 border p-2 rounded">
            <img src={rec.thumbnail} alt="thumb" className="w-12 h-12 object-cover rounded" />
            <div className="flex-1 text-sm">
              {rec.addresses.map((addr) => (
                <p key={addr}>{addr}</p>
              ))}
            </div>
            <button onClick={() => onDelete(rec.id)} className="text-red-500">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
