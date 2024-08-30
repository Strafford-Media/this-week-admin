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
    "\n          query checkImage($url: String!) {\n            checkImage(url: $url) {\n              success\n              error\n              existing_url\n            }\n          }\n        ": types.CheckImageDocument,
    "\n          mutation uploadImage($entityId: Int!, $src: String!, $destination: String) {\n            uploadImage(entityId: $entityId, src: $src, destination: $destination) {\n              success\n              error\n              new_url\n            }\n          }\n        ": types.UploadImageDocument,
    "\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        ": types.UpdateLayoutDataDocument,
    "\n                                    mutation fixImage($entityId: Int!, $src: String!) {\n                                      uploadImage(entityId: $entityId, src: $src, fix: true) {\n                                        success\n                                        error\n                                        fixed_url\n                                      }\n                                    }\n                                  ": types.FixImageDocument,
    "\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n": types.UpdateUserProfileDocument,
    "\n  mutation CreateListingShell($businessName: String!, $slug: String!) {\n    insert_listing_one(object: { business_name: $businessName, slug: $slug }) {\n      id\n    }\n  }\n": types.CreateListingShellDocument,
    "\n  mutation DeleteListing($id: Int!) {\n    delete_listing_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteListingDocument,
    "\n  mutation UpdateListing($id: Int!, $set: listing_set_input!) {\n    update_listing_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateListingDocument,
    "\n  mutation CreateCategory($label: String!, $isPrimary: Boolean) {\n    insert_category_tag_one(object: { label: $label, is_primary: $isPrimary }) {\n      id\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategoryById($id: Int!, $set: category_tag_set_input) {\n    update_category_tag_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateCategoryByIdDocument,
    "\n  mutation DeleteCategoryById($id: Int!) {\n    delete_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteCategoryByIdDocument,
    "\n  mutation DeleteCategoryListingById($id: Int!) {\n    delete_listing_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteCategoryListingByIdDocument,
    "\n  mutation RemoveCategoryListings($ids: [Int!]!) {\n    delete_listing_category_tag(where: { id: { _in: $ids } }) {\n      affected_rows\n    }\n  }\n": types.RemoveCategoryListingsDocument,
    "\n  mutation CreateCategoryListings($objects: [listing_category_tag_insert_input!]!) {\n    insert_listing_category_tag(objects: $objects) {\n      affected_rows\n    }\n  }\n": types.CreateCategoryListingsDocument,
    "\n  mutation CreateAd($object: ad_insert_input!) {\n    insert_ad_one(object: $object) {\n      id\n    }\n  }\n": types.CreateAdDocument,
    "\n  mutation UpdateAd($id: Int!, $set: ad_set_input) {\n    update_ad_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateAdDocument,
    "\n  mutation CreateAdCycle($object: ad_cycle_insert_input!) {\n    insert_ad_cycle_one(object: $object) {\n      id\n    }\n  }\n": types.CreateAdCycleDocument,
    "\n  mutation UpdateAdCycleById($id: Int!, $set: ad_cycle_set_input) {\n    update_ad_cycle_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n": types.UpdateAdCycleByIdDocument,
    "\n  mutation DeleteAdCycleById($id: Int!) {\n    delete_ad_cycle_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteAdCycleByIdDocument,
    "\n  mutation DeleteAd($id: Int!) {\n    delete_ad_by_pk(id: $id) {\n      id\n    }\n  }\n": types.DeleteAdDocument,
    "\n  subscription AllListings {\n    listing(order_by: { business_name: asc }) {\n      business_name\n      island\n      created_at\n      updated_at\n      id\n      tier\n      live\n    }\n  }\n": types.AllListingsDocument,
    "\n  query AllListingsWithCategories {\n    listing(order_by: { business_name: asc }) {\n      id\n      business_name\n      live\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n": types.AllListingsWithCategoriesDocument,
    "\n  query FuzzySearchListings($searchTerm: String!, $includeNonLive: Boolean, $limit: Int!) {\n    fuzzy_search_listings(args: { search: $searchTerm, include_non_live: $includeNonLive }, limit: $limit) {\n      id\n    }\n  }\n": types.FuzzySearchListingsDocument,
    "\n  query ListingByID($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      slug\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      promoted\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      business_hours\n      social_media\n      images\n      videos\n      layout_data\n      lat_lng\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n": types.ListingByIdDocument,
    "\n  query ListingsByCategory($categoryId: Int!) {\n    listing(where: { listing_category_tags: { category_tag_id: { _eq: $categoryId } } }) {\n      id\n      business_name\n      listing_category_tags(where: { category_tag_id: { _eq: $categoryId } }) {\n        id\n      }\n    }\n  }\n": types.ListingsByCategoryDocument,
    "\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n    }\n  }\n": types.GetAdByIdDocument,
    "\n  query AllAds($whereClause: ad_bool_exp) {\n    ad(where: $whereClause, order_by: { updated_at: desc }) {\n      id\n      created_at\n      updated_at\n      name\n      link\n      image\n      size\n    }\n  }\n": types.AllAdsDocument,
    "\n  query getAdCycles {\n    ad {\n      id\n      name\n      image\n      link\n      size\n      ad_cycles(order_by: { starts_at: asc }) {\n        id\n        starts_at\n        ends_at\n        loads\n      }\n    }\n  }\n": types.GetAdCyclesDocument,
    "\n  query AdCycleStatsById($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      ad_events_aggregate {\n        aggregate {\n          variance {\n            id\n            ad_cycle_id\n          }\n        }\n      }\n    }\n  }\n": types.AdCycleStatsByIdDocument,
    "\n  query cycleAnalytics($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      id\n      loads\n      clicks: ad_events_aggregate(where: { event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_clicks: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      views: ad_events_aggregate(where: { event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_views: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": types.CycleAnalyticsDocument,
    "\n  query GetCategoryTags {\n    category_tag(order_by: [{ is_primary: desc }, { label: asc }]) {\n      id\n      label\n      is_primary\n      listing_category_tags_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": types.GetCategoryTagsDocument,
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
export function graphql(source: "\n          query checkImage($url: String!) {\n            checkImage(url: $url) {\n              success\n              error\n              existing_url\n            }\n          }\n        "): (typeof documents)["\n          query checkImage($url: String!) {\n            checkImage(url: $url) {\n              success\n              error\n              existing_url\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation uploadImage($entityId: Int!, $src: String!, $destination: String) {\n            uploadImage(entityId: $entityId, src: $src, destination: $destination) {\n              success\n              error\n              new_url\n            }\n          }\n        "): (typeof documents)["\n          mutation uploadImage($entityId: Int!, $src: String!, $destination: String) {\n            uploadImage(entityId: $entityId, src: $src, destination: $destination) {\n              success\n              error\n              new_url\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        "): (typeof documents)["\n          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {\n            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {\n              id\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                                    mutation fixImage($entityId: Int!, $src: String!) {\n                                      uploadImage(entityId: $entityId, src: $src, fix: true) {\n                                        success\n                                        error\n                                        fixed_url\n                                      }\n                                    }\n                                  "): (typeof documents)["\n                                    mutation fixImage($entityId: Int!, $src: String!) {\n                                      uploadImage(entityId: $entityId, src: $src, fix: true) {\n                                        success\n                                        error\n                                        fixed_url\n                                      }\n                                    }\n                                  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserProfile($id: uuid!, $metadata: jsonb!, $displayName: String) {\n    updateUser(pk_columns: { id: $id }, _set: { displayName: $displayName }, _append: { metadata: $metadata }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateListingShell($businessName: String!, $slug: String!) {\n    insert_listing_one(object: { business_name: $businessName, slug: $slug }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateListingShell($businessName: String!, $slug: String!) {\n    insert_listing_one(object: { business_name: $businessName, slug: $slug }) {\n      id\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation CreateCategory($label: String!, $isPrimary: Boolean) {\n    insert_category_tag_one(object: { label: $label, is_primary: $isPrimary }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($label: String!, $isPrimary: Boolean) {\n    insert_category_tag_one(object: { label: $label, is_primary: $isPrimary }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategoryById($id: Int!, $set: category_tag_set_input) {\n    update_category_tag_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategoryById($id: Int!, $set: category_tag_set_input) {\n    update_category_tag_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategoryById($id: Int!) {\n    delete_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategoryById($id: Int!) {\n    delete_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategoryListingById($id: Int!) {\n    delete_listing_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategoryListingById($id: Int!) {\n    delete_listing_category_tag_by_pk(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCategoryListings($ids: [Int!]!) {\n    delete_listing_category_tag(where: { id: { _in: $ids } }) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveCategoryListings($ids: [Int!]!) {\n    delete_listing_category_tag(where: { id: { _in: $ids } }) {\n      affected_rows\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategoryListings($objects: [listing_category_tag_insert_input!]!) {\n    insert_listing_category_tag(objects: $objects) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategoryListings($objects: [listing_category_tag_insert_input!]!) {\n    insert_listing_category_tag(objects: $objects) {\n      affected_rows\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation CreateAdCycle($object: ad_cycle_insert_input!) {\n    insert_ad_cycle_one(object: $object) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAdCycle($object: ad_cycle_insert_input!) {\n    insert_ad_cycle_one(object: $object) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAdCycleById($id: Int!, $set: ad_cycle_set_input) {\n    update_ad_cycle_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAdCycleById($id: Int!, $set: ad_cycle_set_input) {\n    update_ad_cycle_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAdCycleById($id: Int!) {\n    delete_ad_cycle_by_pk(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAdCycleById($id: Int!) {\n    delete_ad_cycle_by_pk(id: $id) {\n      id\n    }\n  }\n"];
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
export function graphql(source: "\n  query AllListingsWithCategories {\n    listing(order_by: { business_name: asc }) {\n      id\n      business_name\n      live\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllListingsWithCategories {\n    listing(order_by: { business_name: asc }) {\n      id\n      business_name\n      live\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FuzzySearchListings($searchTerm: String!, $includeNonLive: Boolean, $limit: Int!) {\n    fuzzy_search_listings(args: { search: $searchTerm, include_non_live: $includeNonLive }, limit: $limit) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query FuzzySearchListings($searchTerm: String!, $includeNonLive: Boolean, $limit: Int!) {\n    fuzzy_search_listings(args: { search: $searchTerm, include_non_live: $includeNonLive }, limit: $limit) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingByID($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      slug\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      promoted\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      business_hours\n      social_media\n      images\n      videos\n      layout_data\n      lat_lng\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingByID($id: Int!) {\n    listing_by_pk(id: $id) {\n      id\n      slug\n      business_name\n      slogan\n      description\n      island\n      created_at\n      updated_at\n      tier\n      promoted\n      live\n      primary_address\n      primary_phone\n      primary_email\n      primary_web_url\n      this_week_recommended\n      booking_links\n      business_hours\n      social_media\n      images\n      videos\n      layout_data\n      lat_lng\n      listing_category_tags {\n        id\n        category_tag_id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingsByCategory($categoryId: Int!) {\n    listing(where: { listing_category_tags: { category_tag_id: { _eq: $categoryId } } }) {\n      id\n      business_name\n      listing_category_tags(where: { category_tag_id: { _eq: $categoryId } }) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingsByCategory($categoryId: Int!) {\n    listing(where: { listing_category_tags: { category_tag_id: { _eq: $categoryId } } }) {\n      id\n      business_name\n      listing_category_tags(where: { category_tag_id: { _eq: $categoryId } }) {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n    }\n  }\n"): (typeof documents)["\n  query getAdById($id: Int!) {\n    ad_by_pk(id: $id) {\n      id\n      created_at\n      name\n      link\n      image\n      size\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllAds($whereClause: ad_bool_exp) {\n    ad(where: $whereClause, order_by: { updated_at: desc }) {\n      id\n      created_at\n      updated_at\n      name\n      link\n      image\n      size\n    }\n  }\n"): (typeof documents)["\n  query AllAds($whereClause: ad_bool_exp) {\n    ad(where: $whereClause, order_by: { updated_at: desc }) {\n      id\n      created_at\n      updated_at\n      name\n      link\n      image\n      size\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAdCycles {\n    ad {\n      id\n      name\n      image\n      link\n      size\n      ad_cycles(order_by: { starts_at: asc }) {\n        id\n        starts_at\n        ends_at\n        loads\n      }\n    }\n  }\n"): (typeof documents)["\n  query getAdCycles {\n    ad {\n      id\n      name\n      image\n      link\n      size\n      ad_cycles(order_by: { starts_at: asc }) {\n        id\n        starts_at\n        ends_at\n        loads\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdCycleStatsById($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      ad_events_aggregate {\n        aggregate {\n          variance {\n            id\n            ad_cycle_id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AdCycleStatsById($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      ad_events_aggregate {\n        aggregate {\n          variance {\n            id\n            ad_cycle_id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query cycleAnalytics($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      id\n      loads\n      clicks: ad_events_aggregate(where: { event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_clicks: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      views: ad_events_aggregate(where: { event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_views: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query cycleAnalytics($id: Int!) {\n    ad_cycle_by_pk(id: $id) {\n      id\n      loads\n      clicks: ad_events_aggregate(where: { event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_clicks: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"click\" } }) {\n        aggregate {\n          count\n        }\n      }\n      views: ad_events_aggregate(where: { event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n      unique_views: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: \"view\" } }) {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategoryTags {\n    category_tag(order_by: [{ is_primary: desc }, { label: asc }]) {\n      id\n      label\n      is_primary\n      listing_category_tags_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCategoryTags {\n    category_tag(order_by: [{ is_primary: desc }, { label: asc }]) {\n      id\n      label\n      is_primary\n      listing_category_tags_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;