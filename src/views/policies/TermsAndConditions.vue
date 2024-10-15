<script setup>
import Layout from "@/views/shared/Layout.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import BenefitsBanner from "@/views/index/BenefitsBanner.vue";
</script>

<template>
  <layout>
    <div class="bg-theme-white relative">
      <div class="bg-theme-verylightteal py-10">
        <div class="mx-auto max-w-8xl w-full px-6 text-left mb-8">
          <breadcrumbs
            class="text-left w-full col-start-1 md:col-span-4 mb-4"
          />
          <h1 class="mt-12">Terms and Conditions</h1>
          <!-- <div class="my-6 text-xl">
            If you have any questions, be sure to let us know!
          </div> -->
        </div>
      </div>
      <div class="bg-theme-white py-10 px-6">
        <div
          class="max-w-8xl mx-auto flex flex-col md:flex-row w-full gap-6 pt-10 pb-20"
        >
          
        </div>
        <benefits-banner />
      </div>
    </div>
  </layout>
</template>
