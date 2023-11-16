import { graphql } from '../gql'

export const ALL_LISTINGS_SUB = graphql(`
  subscription AllListings {
    listing {
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
