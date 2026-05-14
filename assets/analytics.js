// Vercel Web Analytics
// Official implementation following: https://vercel.com/docs/analytics/quickstart
// This script initializes Vercel Analytics for page views and custom events

(function() {
  // Initialize the analytics queue
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Load the Vercel Analytics script
  // The script will automatically be served from the correct path by Vercel
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
