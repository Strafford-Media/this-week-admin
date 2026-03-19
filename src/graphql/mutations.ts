import { graphql } from '../gql'

export const UPDATE_USER_METADATA = graphql(`
  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {
    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {
      id
    }
  }
`)

export const CREATE_LISTING_SHELL = graphql(`
  mutation CreateListingShell($businessName: String!, $slug: String!) {
    insert_listing_one(object: { business_name: $businessName, slug: $slug }) {
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

export const CREATE_PROMO_CODE = graphql(`
  mutation CreatePromoCode($pc: promo_code_insert_input!) {
    insert_promo_code_one(object: $pc) {
      id
    }
  }
`)

export const UPDATE_PROMO_CODE = graphql(`
  mutation UpdatePromoCode($id: Int!, $set: promo_code_set_input!) {
    update_promo_code_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const DELETE_PROMO_CODE = graphql(`
  mutation DeletePromoCode($id: Int!) {
    delete_promo_code_by_pk(id: $id) {
      id
    }
  }
`)

export const CREATE_CATEGORY = graphql(`
  mutation CreateCategory($label: String!, $isPrimary: Boolean) {
    insert_category_tag_one(object: { label: $label, is_primary: $isPrimary }) {
      id
    }
  }
`)

export const UPDATE_CATEGORY_BY_ID = graphql(`
  mutation UpdateCategoryById($id: Int!, $set: category_tag_set_input) {
    update_category_tag_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const DELETE_CATEGORY_BY_ID = graphql(`
  mutation DeleteCategoryById($id: Int!) {
    delete_category_tag_by_pk(id: $id) {
      id
    }
  }
`)

export const DELETE_CATEGORY_LISTING_BY_ID = graphql(`
  mutation DeleteCategoryListingById($id: Int!) {
    delete_listing_category_tag_by_pk(id: $id) {
      id
    }
  }
`)

export const REMOVE_CATEGORY_LISTINGS = graphql(`
  mutation RemoveCategoryListings($ids: [Int!]!) {
    delete_listing_category_tag(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`)

export const CREATE_CATEGORY_LISTINGS = graphql(`
  mutation CreateCategoryListings($objects: [listing_category_tag_insert_input!]!) {
    insert_listing_category_tag(objects: $objects) {
      affected_rows
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

export const CREATE_AD_CYCLE = graphql(`
  mutation CreateAdCycle($object: ad_cycle_insert_input!) {
    insert_ad_cycle_one(object: $object) {
      id
    }
  }
`)

export const UPDATE_AD_CYCLE = graphql(`
  mutation UpdateAdCycleById($id: Int!, $set: ad_cycle_set_input) {
    update_ad_cycle_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const DELETE_AD_CYCLE = graphql(`
  mutation DeleteAdCycleById($id: Int!) {
    delete_ad_cycle_by_pk(id: $id) {
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

export const CREATE_VISITOR_QUESTION = graphql(`
  mutation CreateVisitorQuestion($input: visitor_question_insert_input!) {
    insert_visitor_question_one(object: $input) {
      id
    }
  }
`)

export const UPDATE_VISITOR_QUESTION = graphql(`
  mutation UpdateVisitorQuestion($id: Int!, $set: visitor_question_set_input) {
    update_visitor_question_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const UPDATE_VISITOR_QUESTIONS = graphql(`
  mutation UpdateVisitorQuestions($updates: [visitor_question_updates!]!) {
    update_visitor_question_many(updates: $updates) {
      affected_rows
    }
  }
`)

export const DELETE_VISITOR_QUESTION = graphql(`
  mutation DeleteVisitorQuestion($id: Int!) {
    delete_visitor_question_by_pk(id: $id) {
      id
    }
  }
`)
