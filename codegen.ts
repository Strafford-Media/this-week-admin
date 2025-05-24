import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'https://local.graphql.local.nhost.run/v1': {
        headers: {
          'x-hasura-admin-secret': 'nhost-admin-secret',
        },
      },
    },
  ],
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
