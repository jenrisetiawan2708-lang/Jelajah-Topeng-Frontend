import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Jelajah Topeng
        </h1>

        <p className="mt-2 text-gray-500">
          Dashboard Kuratorial
        </p>
      </main>
    </div>
  )
}

export default App