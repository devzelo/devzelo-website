// Vercel Web Analytics
// Official implementation following: https://vercel.com/docs/analytics/quickstart
// This script loads the Vercel Analytics tracking code for page views and custom events

(function() {
  // Only inject analytics in production environments
  // Vercel automatically sets window.location.hostname in production
  var isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' && 
                     !window.location.hostname.includes('192.168.');
  
  if (isProduction) {
    // Load Vercel Analytics script from CDN
    var script = document.createElement('script');
    script.src = 'https://cdn.vercel-insights.com/v1/script.js';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
