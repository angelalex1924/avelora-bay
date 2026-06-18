export const SHOPIFY_ORDER_RECEIPT_QUERY = `
  query OrderReceipt($id: ID!) {
    order(id: $id) {
      id
      name
      processedAt
      createdAt
      statusPageUrl
      email
      displayFinancialStatus
      displayFulfillmentStatus
      subtotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalTaxSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalShippingPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      billingAddress {
        name
        address1
        address2
        city
        zip
        country
        phone
      }
      lineItems(first: 50) {
        edges {
          node {
            name
            quantity
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            discountedTotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
      taxLines {
        title
        rate
        ratePercentage
        priceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
    shop {
      name
      contactEmail
      billingAddress {
        address1
        address2
        city
        zip
        country
      }
    }
  }
`;
