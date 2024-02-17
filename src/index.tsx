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
import { Redirect, customizeButtonClasses } from '@8thday/react'
import { AdScheduler } from './components/molecules/AdScheduler'
import { CategoryTagProvider } from './hooks/useCategoryTags'

mapbox.accessToken = 'pk.eyJ1IjoidGVocHNhbG1pc3QiLCJhIjoiY2tjOG1qYWI1MGU0eDJ0bXA4eW9oMWJheiJ9.mbn1UUudizfymnvIOvdCmg'

customizeButtonClasses({
  variants: {
    secondary: `border-transparent bg-secondary-100 text-secondary-700 enabled:hover:bg-secondary-200 focus:ring-secondary-500`,
  },
})

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
        children: [
          { path: ':id', element: <Listing /> },
          { path: '*', element: <Redirect to="" /> },
        ],
      },
      {
        path: 'profile',
        element: <Profile />,
        children: [
          { path: 'change-password', element: <ChangePassword /> },
          { path: '*', element: <Redirect to="" /> },
        ],
      },
      {
        path: 'ads',
        element: <Ads />,
        children: [
          {
            path: 'scheduler',
            element: <AdScheduler />,
            children: [
              {
                path: ':adId',
                element: <AdScheduler />,
                children: [{ path: ':cycleId', element: <AdScheduler /> }],
              },
            ],
          },
          {
            path: 'create',
            element: <AdDesigner key="creating" />,
          },
          { path: 'manage/:id', element: <AdDesigner key="managing" /> },
          { path: '*', element: <Redirect to="" /> },
        ],
      },
      { path: '*', element: <Redirect to="" /> },
    ],
  },
])

const root = createRoot(document.getElementById('app')!)

root.render(
  <NhostProvider nhost={nhost}>
    <NhostApolloProvider nhost={nhost}>
      <CategoryTagProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </CategoryTagProvider>
    </NhostApolloProvider>
  </NhostProvider>,
)
