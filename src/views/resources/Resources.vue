<script setup>
import Layout from "@/views/shared/Layout.vue";
import PartnersBanner from "@/views/index/PartnersBanner.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import SubjectIconLinks from "@/views/shared/SubjectIconLinks.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import PopularBundles from "@/views/shared/PopularBundles.vue";
import BundlesBanner from "@/views/index/BundlesBanner.vue";
import PopularBooks from "@/views/shared/PopularBooks.vue";
import alevelBackground from "/assets/alevel-background.png"
import gcseBackground from "/assets/gcse-background.png"
</script>
<template>
  <layout>
    <div class="w-full bg-theme-verylightteal py-10">
      <div class="mx-auto max-w-8xl w-full text-left px-6">
        <breadcrumbs class="text-left w-full" />
        <div class="max-w-screen-sm mr-auto">
          <h1 class="mt-10 max-w-xl">Bundles, books and guides</h1>
          <p class="my-10 text-xl">Everything you need to get through your studies</p>
        </div>
      </div>
    </div>
    <partners-banner class="bg-theme-pale2" />
    <div class="w-full bg-theme-white mt-10 mb-14">
      <div class="max-w-8xl mx-auto flex flex-col ">
        <h2 class="my-6 text-3xl font-medium">Shop by Level</h2>
        <div class="flex flex-col sm:flex-row gap-4 px-10">

          <router-link to="/gcse" :style="{ backgroundImage: 'url(' + gcseBackground + ')'}" class="bg-no-repeat bg-cover w-full sm:w-1/2 h-full object-cover flex flex-col justify-center items-center min-h-60 lg:h-72 rounded-xl">
            <div class="bg-theme-white px-6 py-4 rounded-xl font-semibold">GCSEs</div>
          </router-link>
          <router-link to="/a-level" :style="{ backgroundImage: 'url(' + alevelBackground + ')'}" class="bg-no-repeat bg-cover w-full sm:w-1/2 h-full object-cover flex flex-col justify-center items-center min-h-60 lg:h-72 rounded-xl">
            <div class="bg-theme-white px-6 py-4 rounded-xl font-semibold">A Levels</div>
          </router-link>
        </div>
      </div>
    </div>
<!--    <div class="bg-theme-light">-->
<!--      <div class="max-w-8xl mx-auto flex flex-col py-10">-->
<!--        <div class="flex flex-row px-4">-->
<!--          <h3 class="grow text-4xl text-center sm:text-left">Shop Resource by subject</h3>-->
<!--          <router-link to="/resources/all" class="text-theme-teal underline hidden sm:block">Shop all subjects <chevron-icon width="12" height="12" right class="inline" /> </router-link>-->
<!--        </div>-->
<!--        <subject-icon-links slug="/resources/explore" />-->
<!--      </div>-->
<!--    </div>-->
    <popular-bundles :count="8" />
    <bundles-banner />
    <popular-books :count="8" />
  </layout>
</template>
