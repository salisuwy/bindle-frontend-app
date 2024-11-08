// analytics.js
const eventMapping = {
  addPaymentInfo: { ga4: "add_payment_info", fbq: "AddPaymentInfo" },
  addToBasket: { ga4: "add_to_cart", fbq: "AddToCart" },
  completeRegistration: { ga4: "sign_up", fbq: "CompleteRegistration" },
  contact: { ga4: "contact", fbq: "Contact" },
  initiateCheckout: { ga4: "begin_checkout", fbq: "InitiateCheckout" },
  lead: { ga4: "generate_lead", fbq: "Lead" },
  purchase: { ga4: "purchase", fbq: "Purchase" },
  search: { ga4: "search", fbq: "Search" },
  viewContent: { ga4: "view_item", fbq: "ViewContent" },
  submitApplication: {
    ga4: "submit_application",
    fbq: "SubmitApplication",
  }, // Assuming a custom event for this one,
  applyFilter: { ga4: "apply_filter", fbq: "FilterApplied" }, // Custom filter event,
};

export function trackEvent(event, params = {}) {
  // console.log("Tracking event: " + event);
  // console.log(params);

  // Check if the event exists in the mapping
  const mappedEvent = eventMapping[event];

  if (mappedEvent) {
    // Trigger GA4 event
    if (typeof window.gtag === "function") {
      window.gtag("event", mappedEvent.ga4, params);
    }

    // Trigger Facebook Pixel event
    if (typeof window.fbq === "function") {
      window.fbq("track", mappedEvent.fbq, params);
    }
  } else {
    console.warn(`Event '${event}' is not mapped to GA4 or Facebook Pixel.`);
  }
}

/**
 * import analytics from '@/analytics.js';

export default {
  methods: {
    //--- (1) Add Payment Info
    trackAddPaymentInfo() {
      analytics.trackEvent('addPaymentInfo', {
        currency: 'USD',
        value: 100.00,
        payment_type: 'credit_card'
      });
    },

    // (2) --- Add to Basket
    trackAddToBasket() {
      analytics.trackEvent('addToBasket', {
        item_id: '12345',
        item_name: 'Product Name',
        value: 29.99,
        currency: 'USD'
      });
    },

    // (3) Complete Registration
    trackCompleteRegistration() {
      analytics.trackEvent('completeRegistration', {
        method: 'email',
        success: true
      });
    },

    // (4) ---- Contact
    trackContact() {
      analytics.trackEvent('contact', {
        contact_method: 'email',
        message_subject: 'Support Inquiry'
      });
    },

    // (5) ---- Initiate Checkout
    trackInitiateCheckout() {
      analytics.trackEvent('initiateCheckout', {
        currency: 'USD',
        value: 89.99,
        items: [
          { item_id: '12345', item_name: 'Product 1', quantity: 1 },
          { item_id: '67890', item_name: 'Product 2', quantity: 2 }
        ]
      });
    },

    // (6) Lead
    trackLead() {
      analytics.trackEvent('lead', {
        lead_type: 'subscription',
        value: 0
      });
    },

    // (7) --- Purchase
    trackPurchase() {
      analytics.trackEvent('purchase', {
        transaction_id: 'T12345',
        currency: 'USD',
        value: 299.99,
        items: [
          { item_id: '12345', item_name: 'Product 1', quantity: 1 },
          { item_id: '67890', item_name: 'Product 2', quantity: 2 }
        ]
      });
    },

    // (8) Search
    trackSearch() {
      analytics.trackEvent('search', {
        search_term: 'laptop',
        search_category: 'electronics'
      });
    },

    // (9) View Content
    trackViewContent() {
      analytics.trackEvent('viewContent', {
        content_id: '12345',
        content_type: 'product',
        value: 29.99,
        currency: 'USD'
      });
    },

    // (10) Submit Application
    trackSubmitApplication() {
      analytics.trackEvent('submitApplication', {
        application_type: 'job',
        success: true
      });
    }

    // (11) Search Event
    trackSearch(searchTerm, searchCategory = 'general') {
      analytics.trackEvent('search', {
        search_term: searchTerm,
        search_category: searchCategory
      });
    },

    // (12) Filter Event
    trackFilter(filterParams) {
      analytics.trackEvent('filter', {
        ...filterParams
      });
    },

    // Usage example for search
    this.trackSearch('laptop', 'electronics'); // GA4: search, FBQ: Search
    // Usage example for filtering
    this.trackFilter({ format: 'digital', type: 'ebook' }); // GA4: apply_filter, FBQ: FilterApplied

  }
};

 * 
 * 
 * 
 * 
 * 
 */
