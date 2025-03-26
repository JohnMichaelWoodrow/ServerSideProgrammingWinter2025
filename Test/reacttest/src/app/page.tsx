'use client'

export default function Home() {
  const name = 'John-Michael Woodrow'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">{name}</h1>
      <p className="text-lg">Winter 2025</p>
      <p className="text-lg">06 January - 17 April</p>
      <p className="text-lg">Tuesdays, 08:30 - 10:30</p>
      <p className="text-lg">Thursdays, 08:30 - 11:30</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert(`${name} was here!`)}
      >
        Click Me
      </button>
    </main>
  )
}

