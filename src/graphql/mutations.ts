import { graphql } from '../gql'

export const UPDATE_USER_METADATA = graphql(`
  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {
    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {
      id
    }
  }
`)

export const CREATE_LISTING_SHELL = graphql(`
  mutation CreateListingShell($businessName: String!) {
    insert_listing_one(object: { business_name: $businessName }) {
      id
    }
  }
`)

export const DELETE_LISTING = graphql(`
  mutation DeleteListing($id: Int!) {
    delete_listing_by_pk(id: $id) {
      id
    }
  }
`)

export const UPDATE_LISTING = graphql(`
  mutation UpdateListing($id: Int!, $set: listing_set_input!) {
    update_listing_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const CREATE_AD = graphql(`
  mutation CreateAd($object: ad_insert_input!) {
    insert_ad_one(object: $object) {
      id
    }
  }
`)

export const UPDATE_AD = graphql(`
  mutation UpdateAd($id: Int!, $set: ad_set_input) {
    update_ad_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const DELETE_AD = graphql(`
  mutation DeleteAd($id: Int!) {
    delete_ad_by_pk(id: $id) {
      id
    }
  }
`)
