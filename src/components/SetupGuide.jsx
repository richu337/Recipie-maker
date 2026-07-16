export default function SetupGuide() {
  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-craft-surface border border-gray-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-craft-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-craft-text m-0">Recipe & Material Calculator</h1>
        <p className="text-craft-muted mt-2">Set up Firebase to get started</p>
      </div>

      <div className="bg-craft-bg rounded-xl p-6 space-y-4">
        <h2 className="text-craft-text font-semibold text-lg m-0">Firebase Setup</h2>

        <ol className="list-decimal list-inside text-craft-text-muted text-sm space-y-3">
          <li>
            Go to{' '}
            <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-craft-blue underline">
              Firebase Console
            </a>{' '}
            and create a project
          </li>
          <li>Enable <strong>Authentication</strong> → Anonymous Sign-in</li>
          <li>Create a <strong>Cloud Firestore</strong> database (start in test mode)</li>
          <li>In your project settings, copy the Web App config</li>
        </ol>

        <div className="bg-craft-bg border border-gray-700 rounded-lg p-4">
          <p className="text-craft-muted text-xs mb-2">Create a <code className="text-craft-gold">.env</code> file in the project root:</p>
          <pre className="text-xs text-craft-text font-mono whitespace-pre-wrap">
{`VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}
          </pre>
        </div>

        <p className="text-craft-muted text-xs">
          After setting up the .env file, restart the dev server.
        </p>
      </div>
    </div>
  )
}
