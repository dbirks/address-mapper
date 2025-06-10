interface Props {
  onUpload: (file: File) => void
}

export default function CameraPage({ onUpload }: Props) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Upload Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onUpload(file)
            e.target.value = ''
          }
        }}
        className="file:mr-4 file:px-4 file:py-2 file:border file:border-gray-300 file:rounded"
      />
      <p className="text-gray-500 text-sm">This demo stores data locally.</p>
    </div>
  )
}
