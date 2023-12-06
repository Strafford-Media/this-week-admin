/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        ": types.UpdateLayoutDataDocument,
    "\n                                  mutation fixImage($listingId: Int!, $src: String!) {\n                                    uploadImageToListing(listingId: $listingId, src: $src, fix: true) {\n                                      success\n                                      error\n                                      fixed_url\n                                    }\n                                  }\n                                ": types.FixImageDocument,
    "\n          mutation uploadImage($listingId: Int!, $src: String!, $destination: String) {\n            uploadImageToListing(listingId: $listingId, src: $src, destination: $destination) {\n              success\n              error\n            }\n          }\n        ": types.UploadImageDocument,
    "\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n": types.UpdateUserProfileDocument,
    "\n  mutation CreateListingShell($businessName: String!) {\n    insert_listing_one(object: { business_name: $businessName }) {\n      id\n    }\n  }\n": types.CreateListingShellDocument,
    "\n  mutation DeleteListing($id: Int!) {\n    delete_listing_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteListingDocument,
    "\n  mutation UpdateListing($id: Int!, $set: listing_set_input!) {\n    update_listing_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateListingDocument,
    "\n  mutation CreateAd($object: ad_insert_input!) {\n    insert_ad_one(object: $object) {\n      id\n    }\n  }\n": types.CreateAdDocument,
    "\n  mutation UpdateAd($id: Int!, $set: ad_set_input) {\n    update_ad_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateAdDocument,
    "\n  mutation DeleteAd($id: Int!) {\n    delete_ad_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteAdDocument,
    "\n  subscription AllListings {\n    listing(order_by: { business_name: asc }) {\n      business_name\n      island\n      created_at\n      updated_at\n      id\n      tier\n      live\n    }\n  }\n": types.AllListingsDocument,
    "\n  query ListingByIDSub($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      images\n      videos\n      layout_data\n      listing_category_tags {\n        id\n        category_tag {\n          id\n          label\n        }\n      }\n    }\n  }\n": types.ListingByIdSubDocument,
    "\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n": types.GetAdByIdDocument,
    "\n  query AllAds {\n    ad {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n": types.AllAdsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        "): (typeof documents)["\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                                  mutation fixImage($listingId: Int!, $src: String!) {\n                                    uploadImageToListing(listingId: $listingId, src: $src, fix: true) {\n                                      success\n                                      error\n                                      fixed_url\n                                    }\n                                  }\n                                "): (typeof documents)["\n                                  mutation fixImage($listingId: Int!, $src: String!) {\n                                    uploadImageToListing(listingId: $listingId, src: $src, fix: true) {\n                                      success\n                                      error\n                                      fixed_url\n                                    }\n                                  }\n                                "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation uploadImage($listingId: Int!, $src: String!, $destination: String) {\n            uploadImageToListing(listingId: $listingId, src: $src, destination: $destination) {\n              success\n              error\n            }\n          }\n        "): (typeof documents)["\n          mutation uploadImage($listingId: Int!, $src: String!, $destination: String) {\n            uploadImageToListing(listingId: $listingId, src: $src, destination: $destination) {\n              success\n              error\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateListingShell($businessName: String!) {\n    insert_listing_one(object: { business_name: $businessName }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateListingShell($businessName: String!) {\n    insert_listing_one(object: { business_name: $businessName }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteListing($id: Int!) {\n    delete_listing_by_pk(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteListing($id: Int!) {\n    delete_listing_by_pk(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateListing($id: Int!, $set: listing_set_input!) {\n    update_listing_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateListing($id: Int!, $set: listing_set_input!) {\n    update_listing_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAd($object: ad_insert_input!) {\n    insert_ad_one(object: $object) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAd($object: ad_insert_input!) {\n    insert_ad_one(object: $object) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAd($id: Int!, $set: ad_set_input) {\n    update_ad_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAd($id: Int!, $set: ad_set_input) {\n    update_ad_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAd($id: Int!) {\n    delete_ad_by_pk(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAd($id: Int!) {\n    delete_ad_by_pk(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription AllListings {\n    listing(order_by: { business_name: asc }) {\n      business_name\n      island\n      created_at\n      updated_at\n      id\n      tier\n      live\n    }\n  }\n"): (typeof documents)["\n  subscription AllListings {\n    listing(order_by: { business_name: asc }) {\n      business_name\n      island\n      created_at\n      updated_at\n      id\n      tier\n      live\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingByIDSub($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      images\n      videos\n      layout_data\n      listing_category_tags {\n        id\n        category_tag {\n          id\n          label\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingByIDSub($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      images\n      videos\n      layout_data\n      listing_category_tags {\n        id\n        category_tag {\n          id\n          label\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n"): (typeof documents)["\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllAds {\n    ad {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n"): (typeof documents)["\n  query AllAds {\n    ad {\n      id\n      created_at\n      name\n      link\n      image\n      size\n      live\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;