<script setup>
import { onMounted } from 'vue';
import { consoleLog } from '@/components/helpers/tsUtils';

onMounted(() => {
  consoleLog('Mounted', window.location.href);
  const checkForTokenInUrl = () => {
    const successUrls = [
      'http://localhost:5173/auth/success', // Local dev URL
      'https://bindle.co.uk/auth/success', // Production URL
      'https://staging.bindle.co.uk/auth/success', // Staging
    ];

    if (successUrls.some((url) => window.location.href.startsWith(url))) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      consoleLog(
        'Token received from URL:',
        token,
        successUrls.some((url) => window.location.href.startsWith(url))
      );
      localStorage.setItem('authToken', token);
      if (token && window.opener) {
        window.opener.postMessage({ token }, window.location.origin);
      }

      setTimeout(() => {
        window.close();
      }, 1000);
    }
  };

  checkForTokenInUrl();
});
</script>
