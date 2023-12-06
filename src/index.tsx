import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { NhostClient, NhostProvider } from '@nhost/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { Toaster } from 'react-hot-toast'
import { Home } from './components/molecules/Home'
import { Listings } from './components/molecules/Listings'
import { Listing } from './components/molecules/Listing'
import { Profile } from './components/molecules/Profile'
import { ChangePassword } from './components/molecules/ChangePassword'
import { Ads } from './components/molecules/Ads'
import mapbox from 'mapbox-gl'
import { AdDesigner } from './components/molecules/AdDesigner'

mapbox.accessToken = 'pk.eyJ1IjoidGVocHNhbG1pc3QiLCJhIjoiY2tjOG1qYWI1MGU0eDJ0bXA4eW9oMWJheiJ9.mbn1UUudizfymnvIOvdCmg'

const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
  region: process.env.REACT_APP_NHOST_REGION,
  clientStorageType: 'cookie',
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'listings',
        element: <Listings />,
        children: [{ path: ':id', element: <Listing /> }],
      },
      {
        path: 'profile',
        element: <Profile />,
        children: [{ path: 'change-password', element: <ChangePassword /> }],
      },
      {
        path: 'ads',
        element: <Ads />,
        children: [
          {
            path: 'create',
            element: <AdDesigner key="creating" />,
          },
          { path: 'edit/:id', element: <AdDesigner key="editing" /> },
        ],
      },
    ],
  },
])

const root = createRoot(document.getElementById('app')!)

root.render(
  <NhostProvider nhost={nhost}>
    <NhostApolloProvider nhost={nhost}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </NhostApolloProvider>
  </NhostProvider>,
)
