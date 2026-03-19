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
import { AdDesigner } from './components/molecules/AdDesigner'
import { Redirect, customizeButtonClasses } from '@8thday/react'
import { AdScheduler } from './components/molecules/AdScheduler'
import { CategoryTagProvider } from './hooks/useCategoryTags'
import { SVGIcons } from './components/atoms/SVGIcons'
import { VisitorManagement } from './components/molecules/VisitorManagement'
import { VisitorList } from './components/molecules/VisitorList'
import { RegistrationQuestionManager } from './components/molecules/RegistrationQuestionManager'
import { SurveyResponseGrid } from './components/molecules/SurveyResponseGrid'

customizeButtonClasses({
  variants: {
    secondary: `border-transparent bg-secondary-100 text-secondary-700 enabled:hover:bg-secondary-200 focus:ring-secondary-500`,
    'destructive-outline': 'border-red-300 bg-white text-red-500 enabled:hover:bg-red-50 focus:ring-red-500',
    'secondary-outline':
      'border-primary-300 bg-white text-primary-500 enabled:hover:bg-primary-50 focus:ring-primary-500',
  },
})

const nhost = new NhostClient(
  process.env.REACT_APP_NHOST_SUBDOMAIN === 'local'
    ? {
        subdomain: 'local',
        region: 'local',
        clientStorageType: 'cookie',
      }
    : {
        authUrl: 'https://identity.thisweekhawaii.com/v1',
        storageUrl: 'https://hboobcwwuscftftwhuse.storage.us-east-1.nhost.run/v1',
        graphqlUrl: 'https://graphql.thisweekhawaii.com/v1/graphql',
        functionsUrl: 'https://functions.thisweekhawaii.com/v1',
        clientStorageType: 'cookie',
      },
)

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
          { path: 'manage/:adId', element: <AdDesigner key="managing" /> },
          { path: '*', element: <Redirect to="" /> },
        ],
      },
      {
        path: 'visitor-management',
        children: [
          {
            index: true,
            element: <VisitorManagement />,
          },
          {
            path: 'visitors',
            element: <VisitorList />,
          },
          {
            path: 'registration-questions',
            element: <RegistrationQuestionManager />,
          },
          {
            path: 'survey-responses',
            element: <SurveyResponseGrid />,
          },
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
        <SVGIcons />
      </CategoryTagProvider>
    </NhostApolloProvider>
  </NhostProvider>,
)
