import { graphql } from '../gql'

export const ALL_LISTINGS_SUB = graphql(`
  subscription AllListings {
    listing(order_by: { business_name: asc }) {
      business_name
      island
      created_at
      updated_at
      id
      tier
      live
    }
  }
`)

export const ALL_LISTINGS_WITH_CATEGORIES = graphql(`
  query AllListingsWithCategories {
    listing(order_by: { business_name: asc }) {
      id
      business_name
      live
      listing_category_tags {
        id
        category_tag_id
      }
    }
  }
`)

export const LISTING_BY_ID = graphql(`
  query ListingByIDSub($id: Int!) {
    listing_by_pk(id: $id) {
      id
      business_name
      slogan
      description
      island
      created_at
      updated_at
      tier
      live
      primary_address
      primary_phone
      primary_email
      primary_web_url
      this_week_recommended
      booking_links
      images
      videos
      layout_data
      listing_category_tags {
        id
        category_tag {
          id
          label
        }
      }
    }
  }
`)

export const LISTINGS_BY_CATEGORY = graphql(`
  query ListingsByCategory($categoryId: Int!) {
    listing(where: { listing_category_tags: { category_tag_id: { _eq: $categoryId } } }) {
      id
      business_name
      listing_category_tags(where: { category_tag_id: { _eq: $categoryId } }) {
        id
      }
    }
  }
`)

export const AD_BY_ID = graphql(`
  query getAdById($id: Int!) {
    ad_by_pk(id: $id) {
      id
      created_at
      name
      link
      image
      size
    }
  }
`)

export const ALL_ADS = graphql(`
  query AllAds($whereClause: ad_bool_exp) {
    ad(where: $whereClause, order_by: { updated_at: desc }) {
      id
      created_at
      updated_at
      name
      link
      image
      size
    }
  }
`)

export const ALL_AD_CYCLES = graphql(`
  query getAdCycles {
    ad {
      id
      name
      image
      link
      size
      ad_cycles(order_by: { starts_at: asc }) {
        id
        starts_at
        ends_at
        loads
      }
    }
  }
`)

export const CYCLE_STATS_BY_ID = graphql(`
  query AdCycleStatsById($id: Int!) {
    ad_cycle_by_pk(id: $id) {
      ad_events_aggregate {
        aggregate {
          variance {
            id
            ad_cycle_id
          }
        }
      }
    }
  }
`)

export const CYCLE_ANALYTICS = graphql(`
  query cycleAnalytics($id: Int!) {
    ad_cycle_by_pk(id: $id) {
      id
      loads
      clicks: ad_events_aggregate(where: { event_type: { _eq: "click" } }) {
        aggregate {
          count
        }
      }
      unique_clicks: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: "click" } }) {
        aggregate {
          count
        }
      }
      views: ad_events_aggregate(where: { event_type: { _eq: "view" } }) {
        aggregate {
          count
        }
      }
      unique_views: ad_events_aggregate(where: { unique: { _eq: true }, event_type: { _eq: "view" } }) {
        aggregate {
          count
        }
      }
    }
  }
`)

export const GET_CATEGORY_TAGS = graphql(`
  query GetCategoryTags {
    category_tag(order_by: [{ is_primary: desc }, { label: asc }]) {
      id
      label
      is_primary
      listing_category_tags_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`)
