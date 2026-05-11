const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-sm">
        Quotes of the Day — connecting to {backendUrl}
      </p>
    </div>
  )
}
