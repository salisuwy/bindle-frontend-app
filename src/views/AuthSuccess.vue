<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    console.log("Mounted", window.location.href)
    const checkForTokenInUrl = () => {
        const successUrls = [
            "http://localhost:5173/auth/success", // Local dev URL
            "https://bindle.co.uk/auth/success",  // Production URL
        ];

        if (successUrls.some(url => window.location.href.startsWith(url))) {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            localStorage.setItem("authToken", token);
            if (token && window.opener) {
                window.opener.postMessage({ token }, window.location.origin);
            }

            setTimeout(() => {
                window.close();
            }, 1000);
        }
    };

    checkForTokenInUrl();
})
</script>
