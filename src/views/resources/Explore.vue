<script setup>
import Layout from "@/views/shared/Layout.vue";
import {ref, watch, computed, onMounted, onUnmounted, nextTick} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useBindleApiStore} from "@/store/bindle-api.js";
import FiltersIcon from "@/components/icons/FiltersIcon.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import Accordion from "@/components/Accordion.vue";
import Bundle from "@/views/shared/Bundle.vue";
import Book from "@/views/shared/Book.vue";
import Pagination from "@/components/Pagination.vue";
import {Util} from "@/components/helpers/Util.js";

const route = useRoute();
const router = useRouter();
const bindleApiStore = useBindleApiStore();

const subjects = ref('all');
const levels = ref('all');
const types = ref({});
const formats = ref([])
const trueTypeSlugs = ref([]);
const examboards = ref({});
const books = ref({});
const bundles = ref({});

const itemsPerPage = ref(16);

const filtersLoaded = ref(false)
const filtersRef = ref(null)

const exploreRef = ref(null)

// special case just to make things tricky
const bundleType = {id:4, name:"Bundles", slug:'bundles'};

const filterSubject = computed({
    get: () => route.query.subject || 'all',
    set: (newValue) => {
        const newQuery = {...route.query, subject: newValue };
        if (('page' in newQuery) && (newQuery.page!==1)) {
            newQuery.page=1;
        }
        router.push({query: newQuery}).catch(err => {
            console.error(err)
        });
    }
});
const filterSubjectId = computed(()=>{
    if (!filterSubject.value) {
        return null;
    }
    const findSubject = Object.values(subjects.value).find((subject) => subject.slug===filterSubject.value);
    return findSubject ? findSubject.id : null;
});

const filterLevel = computed({
    get: () => {
        return route.query.level ? route.query.level.split(',') : [];
    },
    set: (newValue) => {
        const newQuery = { ...route.query };
        if (('page' in newQuery) && (newQuery.page!==1)) {
            newQuery.page=1;
        }
        if (newValue.length>0) {
            newQuery.level = newValue.join(',')
        }
        else {
            delete newQuery.level
        }
        router.push({ query: newQuery }).catch(err => { console.error(err) });
    }
});
const filterLevelIds = computed(()=>{
    if (!filterLevel.value) {
        return null;
    }
    const filterLevels = [];
    Object.values(levels.value).forEach((level) => {
        if (filterLevel.value.includes(level.slug)) {
            filterLevels.push(level.id);
        }
    });
    return filterLevels;
});

const filterType = computed({
    get: () => {
        return route.query.type ? route.query.type.split(',') : [];
    },
    set: (newValue) => {
        const newQuery = {...route.query};
        if (('page' in newQuery) && (newQuery.page!==1)) {
            newQuery.page=1;
        }
        if (newValue.length > 0) {
            newQuery.type = newValue.join(',');
        } else {
            delete newQuery.type;
        }
        router.push({query: newQuery}).catch(err => {
            console.error(err);
        });
    }
});
const filterTypeIds = computed(()=>{
    if (!filterType.value) {
        return null;
    }
    const buildFilterTypeIds = [];
    Object.values(types.value).forEach((type) => {
        if (filterType.value.includes(type.slug)) {
            buildFilterTypeIds.push(type.id)
        }
    });
    return buildFilterTypeIds;
});
const hasOneTrueFilterType = computed(()=> {
    let count=0;
    trueTypeSlugs.value.forEach((slug) => {
        if (filterType.value.includes(slug)) {
            count+=1;
        }
    })
    return count>0;
});
const trueFilterTypeIds = computed(()=> {
  return filterTypeIds.value.filter((typeId) => typeId !== bundleType.id);
});
const bundleOnlyFilter = computed(()=> {
  return filterTypeIds.value.includes(bundleType.id);
});

const filterExamboard = computed({
    get: () => {
        return route.query.examboard ? route.query.examboard.split(',') : [];
    },
    set: (newValue) => {
        const newQuery = {...route.query, page:1};
        if (('page' in newQuery) && (newQuery.page!==1)) {
            newQuery.page=1;
        }
        if (newValue.length > 0) {
            newQuery.examboard = newValue.join(',');
        } else {
            delete newQuery.examboard;
        }
        router.push({query: newQuery}).catch(err => {
            console.error(err);
        });
    }
});
const filterExamboardIds = computed(()=>{
    if (!filterExamboard.value) {
        return null;
    }
    const buildFilterExamboardIds = [];
    Object.values(examboards.value).forEach((examboard) => {
        if (filterExamboard.value.includes(examboard.slug)) {
            buildFilterExamboardIds.push(examboard.id)
        }
    });
    return buildFilterExamboardIds;
});

const pageIdx = computed({
    get: () => parseInt(route.query.page,10) || 1,
    set: (newValue) => {
        const intValue = parseInt(newValue,10);
        if (intValue !== parseInt(route.query.page, 10)) {
            router.push({query: {...route.query, page: newValue}}).catch(err => {
                console.error(err)
            });
        }
    }
});

const filteredProducts = computed(()=> {
    let buildFilteredProducts = [];
    if (bundles.value && books.value) {
        let filteredBundles = Object.values(bundles.value).filter((bundle) => {
            if (bundle.book_ids.length===0) {
                return false;
            }
            const bundleBooks = Object.values(books.value).filter((bundleBook) => bundle.book_ids.includes(bundleBook.id));

            // format type ebook and paperback
            if(formats.value.length>0) 
            {
                if(formats.value.includes("ebook") && formats.value.includes("paperback")) {}
                else if(formats.value.includes("ebook") && (!bundle.is_ebook)) 
                {
                    return false;
                }
                else if(formats.value.includes("paperback") && bundle.is_ebook)
                {
                    return false;
                }
            }

            // subjects
            if (
                (filterSubject.value!=='all')
                &&
                !bundleBooks.some((book) => book.subject_ids.includes(filterSubjectId.value))
            ) {
                return false;
            }
            // qualification level
            if (
                (filterLevel.value.length>0)
                &&
                filterLevel.value.length < Object.keys(levels.value).length
                &&
                !bundleBooks.some((book) => filterLevel.value.includes(book.level_id))
            ) {
                return false;
            }
            // resource type

            if (
                hasOneTrueFilterType.value
                &&
                !bundleBooks.some((book) => trueFilterTypeIds.value.includes(book.type_id))
            ) {
                return false;
            }
            // examboards
            if (
                filterExamboard.value.length>0
                &&
                filterExamboard.value.length < Object.keys(examboards.value).length
                &&
                !bundleBooks.some((book) => filterExamboardIds.value.includes(book.examboard_id))
            ) {
                return false;
            }
            if ('q' in route.query) {
                if (bundleBooks.some((book) => { return book.title.search(new RegExp(route.query.q,'i')) === -1; })) {
                    return false;
                }
            }
            return true;
        });
        buildFilteredProducts.push(...filteredBundles);
    }
    if (books.value && !bundleOnlyFilter.value) {
        let filteredBooks = Object.values(books.value).filter((book) => {

            // format type ebook and paperback
            if(formats.value.length>0) 
            {
                if(formats.value.includes("ebook") && formats.value.includes("paperback")) {}
                else if(formats.value.includes("ebook") && (!book.is_ebook)) 
                {
                    return false;
                }
                else if(formats.value.includes("paperback") && book.is_ebook)
                {
                    return false;
                }
            }

            // subject
            if (filterSubject.value !== 'all') {
                if (!book.subject_ids.includes(filterSubjectId.value)) {
                    return false;
                }
            }
            // level
            if (
                filterLevel.value.length>0
                &&
                filterLevel.value.length < Object.keys(levels.value).length
                &&
                !filterLevelIds.value.includes(book.level_id)
            ) {
                return false;
            }
            // resource type
            if (
                hasOneTrueFilterType.value
                &&
                !trueFilterTypeIds.value.includes(book.type_id)
            ) {
                return false;
            }
            // examboard
            if (
                filterExamboard.value.length > 0
                &&
                filterExamboard.value.length < Object.keys(examboards.value).length
                &&
                !filterExamboardIds.value.includes(book.examboard_id)
            ) {
                return false;
            }
            if ('q' in route.query) {
                if (book.title.search(new RegExp(route.query.q,'i')) === -1) {
                    return false;
                }
            }
            return true;
        });
        buildFilteredProducts.push(...filteredBooks);
    }
    return buildFilteredProducts;
});

const paginatedProducts = computed(() => {
    return filteredProducts.value.slice(
        ((pageIdx.value - 1) * itemsPerPage.value),
        (pageIdx.value * itemsPerPage.value)
    );
});

const filterSubjectAccordionRef = ref()
const filterLevelAccordionRef = ref()
const filterTypeAccordionRef = ref()
const filterExamboardAccordionRef = ref()

const quickFilter = (type) => {
    if (type === 'gcse') {
        router.push({query: {level: 'gcse',subject:'all'}});
        filterSubjectAccordionRef.value.close();
        filterLevelAccordionRef.value.open();
        filterTypeAccordionRef.value.close();
        filterExamboardAccordionRef.value.close();
    } else if (type === 'a-level') {
        router.push({query: {level: 'a-level', subject:'all'}});
        filterSubjectAccordionRef.value.close();
        filterLevelAccordionRef.value.open();
        filterTypeAccordionRef.value.close();
        filterExamboardAccordionRef.value.close();
    } else if (type === 'bundle') {
        alert('not yet implemented');
    } else if (type === 'bestseller') {
        alert('not yet implemented');
    } else if (type === 'sale') {
        alert('not yet implemented');
    }
}

const toggleMobileFilters = () => {
    if (filtersRef.value) {
        if (!filtersRef.value.classList.contains('mobile-menu')) {
            filtersRef.value.classList.add('mobile-menu');
        }
        if (filtersRef.value.classList.contains('mobile-menu-open')) {
            filtersRef.value.classList.remove('mobile-menu-open');
        } else {
            filtersRef.value.classList.add('mobile-menu-open');
        }
    }
}

const closeMobileFilters = () => {
    if (filtersRef.value.classList.contains('mobile-menu-open')) {
        filtersRef.value.classList.remove('mobile-menu-open');
    }
}

const resizeWindow = () => {
    if (window.innerWidth >= 768 && filtersRef.value && filtersRef.value.classList.contains('mobile-menu')) {
        filtersRef.value.classList.remove('mobile-menu');
        filtersRef.value.classList.remove('mobile-menu-open');
    } else if (window.innerWidth < 768 && filtersRef.value && !filtersRef.value.classList.contains('mobile-menu')) {
        filtersRef.value.classList.add('mobile-menu');
    }
}

onMounted(async () => {
    window.addEventListener('resize', resizeWindow);

    await bindleApiStore.getSubjects();
    subjects.value = bindleApiStore.subjects;

    await bindleApiStore.getLevels();
    levels.value = bindleApiStore.levels;

    await bindleApiStore.getTypes();
    Object.keys(bindleApiStore.types).forEach((key) => {
        trueTypeSlugs.value.push(bindleApiStore.types[key].slug);
    });
    types.value = bindleApiStore.types;
    types.value[bundleType.id] = bundleType;

    await bindleApiStore.getExamboards();
    examboards.value = bindleApiStore.examboards;
    filtersLoaded.value = true;

    await bindleApiStore.getBooks();
    books.value = bindleApiStore.books;

    await bindleApiStore.getBundles()
    bundles.value = bindleApiStore.bundles;

    if ('subject' in route.query && route.query.subject!=='all') {
        await nextTick();
        filterSubjectAccordionRef.value.open();
    }
    if ('level' in route.query && route.query.level!=='all') {
        await nextTick();
        filterLevelAccordionRef.value.open();
    }
    if ('type' in route.query) {
        await nextTick();
        filterTypeAccordionRef.value.open();
    }
    if ('examboard' in route.query) {
        await nextTick();
        filterExamboardAccordionRef.value.open();
    }
});
onUnmounted(async () => {
    window.removeEventListener('resize', resizeWindow);
});
const paginationNavigation = () => {
    setTimeout(()=> {
        window.scrollTo({top:0, left:0, behavior:'smooth'});
    },100)
};

const getTitle = (()=> {
    return filterSubject.value==='all'
        ? "Resources"
        : Util.humaniseSnakeCase(filterSubject.value);
});
</script>
<template>
    <layout>
        <div class="bg-theme-white py-10 relative">
            <div  ref="exploreRef"  class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
                <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4"/>
            </div>

            <div class="mx-auto max-w-8xl w-full text-left px-6 grid grid-cols-1 md:grid-cols-4 ">
                <div class="titlebar md:col-start-2 md:col-span-3 row-start-2 text-wrap">
                    <div class="flex flex-row pb-4">
                        <h1 class="text-4xl md:text-4xl">{{ getTitle() }}</h1>
                        <div class="md:hidden grow pt-2 cursor-pointer" @click="toggleMobileFilters()">
                            <filters-icon class="ml-auto"/>
                        </div>
                    </div>
                </div>

                <div ref="filtersRef"
                     :class="'filters hidden md:flex md:flex-col md:row-start-2 col-start-1 md:row-span-3 text-wrap pr-4 gap-2'+(filtersLoaded ? '' : ' working-spinner pointer-events-none')">
                    <div class="quick-select hidden md:block">
                        <h3 class="md:text-sm lg:text-base">BROWSE ALL RESOURCES BY</h3>
                        <div @click="quickFilter('gcse')" class="cursor-pointer linklike">GCSEs</div>
                        <div @click="quickFilter('a-level')" class="cursor-pointer linklike">A-Levels</div>
<!--                        <div @click="quickFilter('bundle')" class="cursor-pointer linklike">Explore Bundles</div>-->
<!--                        <div @click="quickFilter('bestseller')" class="cursor-pointer linklike">Bestsellers</div>-->
<!--                        <div @click="quickFilter('sale')" class="cursor-pointer linklike">Sale</div>-->
                    </div>

                    <hr class="hidden md:block mb-2"/>

                    <accordion ref="filterSubjectAccordionRef"
                               content-class="filter-subjects w-full flex flex-col"
                               title-class="md:text-sm lg:text-base cursor-pointer linklike"
                               indicator-class="float-right">
                        <template #title><h3 class="inline-block">EXAM SUBJECT</h3></template>
                        <template #indicator>
                            <chevron-icon down class="inline-block"/>
                        </template>

                        <hr class="hidden md:block w-full my-4"/>

                        <div class="radio-links">
                            <div>
                                <input v-model="filterSubject" id="filter-subject-all" type="radio" value="all">
                                <label for="filter-subject-all" class="cursor-pointer mr-auto">All</label>
                            </div>
                            <div v-for="subject in subjects">
                                <input v-model="filterSubject" type="radio" name="subject" :value="subject['slug']" :id="'filter-subject-'+subject['slug']" />
                                <label :for="'filter-subject-'+subject['slug']" class="cursor-pointer mr-auto" >{{ subject['name'] }}</label>
                            </div>
                        </div>
                    </accordion>

                    <hr class="mb-2"/>

                    <accordion ref="filterTypeAccordionRef" content-class="filter-level flex flex-col" title-class="md:text-sm lg:text-base cursor-pointer linklike" indicator-class="float-right">
                        <template #title><h3 class="inline-block">RESOURCE FORMAT</h3></template>
                        <template #indicator><chevron-icon down class="inline-block" /></template>
                        <hr class="hidden md:block w-full my-4"/>
                        <label v-if="filtersLoaded" class="bindle-checkbox cursor-pointer mr-auto">
                            <input v-model="formats" type="checkbox" value="ebook" />
                            E-Book
                        </label>
                        <label v-if="filtersLoaded" class="bindle-checkbox cursor-pointer mr-auto">
                            <input v-model="formats" type="checkbox" value="paperback" />
                            Paperback
                        </label>
                    </accordion>

                    <hr class="mb-2"/>

                    <accordion ref="filterLevelAccordionRef"
                               content-class="w-full filter-level flex flex-col"
                               title-class="md:text-xs lg:text-base cursor-pointer linklike"
                               indicator-class="float-right">
                        <template #title><h3 class="inline-block">QUALIFICATION LEVEL</h3></template>
                        <template #indicator>
                            <chevron-icon down class="inline-block"/>
                        </template>
                        <hr class="hidden md:block w-full my-4"/>
                        <label v-if="filtersLoaded" v-for="level in levels" :key="level['slug']"
                               class="bindle-checkbox cursor-pointer mr-auto">
                            <input v-model="filterLevel" type="checkbox" :value="level['slug']"/>
                            {{ level['name'] }}s
                        </label>
                    </accordion>

                    <hr class="mb-2"/>

                    <accordion ref="filterTypeAccordionRef"
                               content-class="w-full filter-level flex flex-col"
                               title-class="md:text-sm lg:text-base cursor-pointer linklike"
                               indicator-class="float-right">
                        <template #title><h3 class="inline-block">RESOURCE TYPE</h3></template>
                        <pre>{{  types }}</pre>
                        <template #indicator>
                            <chevron-icon down class="inline-block"/>
                        </template>
                        <hr class="hidden md:block w-full my-4"/>
                        <label v-if="filtersLoaded" v-for="(type) in types" :key="type['slug']"
                               class="bindle-checkbox cursor-pointer mr-auto">
                            <input v-model="filterType" type="checkbox" :value="type['slug']"/>
                            {{ type['name'] }}
                        </label>
                    </accordion>

                    <hr class="mb-2"/>

                    <accordion ref="filterExamboardAccordionRef"
                               content-class="w-full filter-level flex flex-col"
                               title-class="md:text-sm lg:text-base cursor-pointer linklike"
                               indicator-class="float-right">
                        <template #title><h3 class="inline-block">EXAM BOARD</h3></template>
                        <template #indicator>
                            <chevron-icon down class="inline-block"/>
                        </template>
                        <hr class="hidden md:block w-full my-4"/>
                        <label v-if="filtersLoaded" v-for="(examboard) in examboards" :key="examboard['slug']"
                               class="bindle-checkbox cursor-pointer mr-auto">
                            <input type="checkbox" v-model="filterExamboard" :value="examboard['slug']">
                            {{ examboard['description'] }}
                        </label>
                    </accordion>

                    <div class="md:hidden">
                        <hr class="mb-2"/>
                        <button class="mx-auto block mt-4" @click="closeMobileFilters">Close Filters</button>
                    </div>
                </div>

                <div :class="'products md:col-start-2 md:col-span-3 row-start-3 text-wrap flex flex-row flex-wrap'">
                    <div v-if="paginatedProducts.length>0" v-for="product in paginatedProducts" class="w-full sm:w-1/2 xl:w-1/4 px-2">
                        <bundle v-if="'book_ids' in product" :bundle="product" mobile-flex-row />
                        <book v-else-if="!bundleOnlyFilter" :product="product" mobile-flex-row />
                    </div>
                    <div v-else-if="filtersLoaded">No results</div>
                </div>
                <pagination
                    v-if="filteredProducts.length>0"
                    class='gap-4 md:col-start-2 md:col-span-3 row-start-5 mt-8 ml-auto'
                    item-class="bg-transparent text-black rounded-sm px-3 py-1"
                    item-selected-class="!opacity-100 !text-theme-teal outline outline-2 outline-theme-teal"
                    arrow-class="!text-theme-teal disabled:!text-theme-black disabled:opacity-30"
                    v-model="pageIdx"
                    :items-per-page="itemsPerPage"
                    :total-items="filteredProducts.length"
                    arrow-controls
                    @navigation="paginationNavigation"
                />
            </div>
        </div>
    </layout>
</template>
<style scoped>
:deep(.accordion-content) {
    position: relative;
    top: -8px;
}

.filters.mobile-menu {
    opacity: 0;
    display: flex;
    flex-direction: column;
    transition: 200ms opacity ease-in-out;
    position: absolute;
    top: 168px;
    left: 0;
    right: 0;
    box-shadow: 0 0 5px #555;
    padding: 20px;
}

.filters.mobile-menu-open {
    background-color: white;
    opacity: 1;
    z-index: 1;
}
</style>