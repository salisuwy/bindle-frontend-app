<template>
    <MinimalLayout>
        <div class="register-user-container flex justify-center items-center">
            <div class="login-box w-full max-w-md bg-white rounded-lg shadow-md text-left">
                <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Pick your subjects
                </h1>
                <div class="p-6">
                    <div v-for="(selected, index) in selectedCourses" :key="selected.id"
                        class=" border-l-4 w-50 bg-theme-pal flex flex-row pt-2 mb-4"
                        :class="`border-l-${randomColor(index)}-400`">
                        <input type="text" :value="selected.name" :readonly="true" class="border-b p-2 grow ml-4 " />
                    </div>
                    <div v-if="selectedCourses.length < 4"
                        class="border-l-4 w-50 bg-theme-pal flex flex-row pt-2 mb-4 items-center border-l-green-400">
                        <input ref="courseSearchInputRef" type="text" v-model="searchText"
                            v-on:keyup.enter="performSearch" placeholder="Type to Search"
                            class="border-b p-2 grow ml-2" />

                        <i v-if="coursesStore.isCoursesLoading === 'loading'"
                            class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                    </div>
                    <div v-if="coursesStore.isCoursesLoading === 'success'">
                        <ul>
                            <li v-for="course in coursesStore.courses" :key="course.id" @click="selectCourse(course)"
                                class="bg-theme-pale my-2 p-2 grow ml-4 border-solid border-theme-lightgray cursor-pointer hover:bg-theme-lightteal flex flex-row justify-between">
                                <span>{{ course.name }}</span>
                                <i class="fa fa-solid fa-plus ml-2 text-teal-400"></i>
                            </li>
                        </ul>
                    </div>

                    <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md my-4"
                        @click="onAttachCourses">Continue</button>
                </div>
            </div>

        </div>
    </MinimalLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import MinimalLayout from "@/views/shared/MinimalLayout.vue";

import { useAuthStore } from "@/store/useAuthStore";
import { useCoursesStore } from "@/store/useCoursesStore";

const authStore = useAuthStore();
const coursesStore = useCoursesStore();

const router = useRouter();

const searchText = ref("");
const selectedCourses = ref([]);

const performSearch = () => {
    console.log("fetchCourses", coursesStore.fetchCourses)
    coursesStore.fetchCourses({
        keyword: searchText.value,
        limit: 8,
        page: 1,
    });
};

const selectCourse = (course) => {
    console.log("selectedCourse", course);
    selectedCourses.value.push(course);
    console.log("selectedCourses", selectedCourses.value, course, "hello");
    coursesStore.resetCourses();
    searchText.value = "";
}

const onAttachCourses = async () => {
    console.log("onAttachCourses", selectedCourses.value, "helllo");
    const courseIds = selectedCourses.value.map(course => course.id);
    await coursesStore.attachMultipleCourses({
        course_ids: courseIds
    });
    router.push(`/user/${authStore.user.id}`);
}

// Generate a random border color
const randomColor = (index) => {
    console.log("randomColor", index);
    const colors = ["blue", "red", "yellow", "green"];
    return colors[index];
};
</script>