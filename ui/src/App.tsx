import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom'
import { Camera, List as ListIcon, Map as MapIcon } from 'lucide-react'
import CameraPage from './pages/CameraPage'
import ListPage from './pages/ListPage'
import MapPage from './pages/MapPage'

export interface RecordItem {
  id: string
  thumbnail: string
  addresses: string[]
  coordinates: { lat: number; lng: number }[]
}

function BottomNav() {
  const location = useLocation()
  const items = [
    { to: '/camera', icon: <Camera />, label: 'Camera' },
    { to: '/list', icon: <ListIcon />, label: 'List' },
    { to: '/map', icon: <MapIcon />, label: 'Map' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around py-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-sm ${location.pathname === item.to ? 'text-blue-600' : 'text-gray-600'}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

function App() {
  const [records, setRecords] = useState<RecordItem[]>(() => {
    const stored = localStorage.getItem('records')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records))
  }, [records])

  function addRecord(file: File) {
    const id = crypto.randomUUID()
    const thumbnail = URL.createObjectURL(file)
    const addresses = ['123 Main St, Example']
    const coordinates = [{ lat: 39.7684, lng: -86.1581 }]
    setRecords((r) => [...r, { id, thumbnail, addresses, coordinates }])
  }

  function deleteRecord(id: string) {
    setRecords((r) => r.filter((rec) => rec.id !== id))
  }

  return (
    <Router>
      <div className="pb-16 max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<CameraPage onUpload={addRecord} />} />
          <Route path="/camera" element={<CameraPage onUpload={addRecord} />} />
          <Route path="/list" element={<ListPage records={records} onDelete={deleteRecord} />} />
          <Route path="/map" element={<MapPage records={records} />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
