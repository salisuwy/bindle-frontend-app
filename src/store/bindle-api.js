import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AsyncOperationManager } from "@/components/helpers/AsyncOperationManager.js";
import { Util } from "@/components/helpers/Util.js";
import axios from "axios";

/**
 * @see https://pinia.vuejs.org/core-concepts/#Setup-Stores
 */
export const useBindleApiStore = defineStore("bindleApi", () => {
  const API_ENDPOINT =
    import.meta.env.VITE_API_ENDPOINT || "https://service.bindle.co.uk/api/";

  const OBTAIN_BOOKS_FROM_LEVELS = true;
  const SIMULATE_HOMEPAGE_API = true;

  const asyncManager = new AsyncOperationManager();

  // direct
  const books = ref(null);
  const bundles = ref(null);
  const examboards = ref(null);
  const levels = ref(null);
  const subjects = ref(null);
  const types = ref(null);
  const homepageData = ref(null);

  // indexes
  let bookIdBySlugIndex = {};
  let bookIdByLevelIndex = {};
  let bookIdBySubjectIndex = {};
  let bookIdByLevelSubjectIndex = {};
  let bundleIdBySlugIndex = {};
  let bundleIdByLevelIndex = {};
  let bundleIdBySubjectIndex = {};
  let bundleIdByLevelSubjectIndex = {};
  let levelIdBySlugIndex = {};
  let subjectIdBySlugIndex = {};
  let coreBundleIds = [];
  let workbookBundleIds = [];

  // other
  let featuredBookIds = [];

  // api doesn't appear to yet have these
  const popularBooks = ref(null);
  const popularBundles = ref(null);

  // helpers
  const routingFailed = ref(false);

  const fetchAll = async (apiCall) => {
    return await asyncManager.execute("fetch:" + apiCall, async () => {
      const allResults = {};
      let result = await fetchOne(apiCall);
      while (true) {
        Object.keys(result.data).forEach((key) => {
          const datum = result.data[key];
          allResults[datum.id] = datum;
        });
        if (result.links.next === null) {
          break;
        } else {
          result = await fetchOne(result.links.next);
        }
      }
      return allResults;
    });
  };

  const fetchOne = async (apiCall) => {
    const response = await fetch(apiCall, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  };

  const getHomepageData = async () => {
    return await asyncManager.execute("getHomepageData", async () => {
      if (SIMULATE_HOMEPAGE_API) {
        await getBooks();
        await getBundles();
        return {
          featured_bindles: Util.getRandom(Object.values(bundles.value), 6),
          featured_books: Util.getRandom(Object.values(books.value), 6),
          featured_ebooks: [],
          subjects: await getSubjects(),
        };
      } else {
        if (homepageData.value === null) {
          homepageData.value = await fetchAll(API_ENDPOINT.slice(0, -1));
        }
        return homepageData.value;
      }
    });
  };

  const getLevels = async () => {
    return await asyncManager.execute("getLevels", async () => {
      if (levels.value === null) {
        const results = await fetchAll(API_ENDPOINT + "levels");
        const buildLevels = {};
        Object.keys(results).forEach((key) => {
          const result = results[key];
          buildLevels[result.id] = result;
        });
        levels.value = buildLevels;
        Object.keys(buildLevels).forEach((levelId) => {
          const level = buildLevels[levelId];
          levelIdBySlugIndex[level.slug] = levelId;
        });
      }
      return levels.value;
    });
  };
  const getLevelById = async (level_id) => {
    await getLevels();
    return levels.value[level_id] ?? null;
  };

  const getSubjects = async () => {
    return await asyncManager.execute("getSubjects", async () => {
      if (subjects.value === null) {
        const results = await fetchAll(API_ENDPOINT + "subjects");
        const buildSubjects = {};
        Object.keys(results).forEach((key) => {
          const result = results[key];
          buildSubjects[result.id] = result;
        });
        subjects.value = tempAdjustSubjects(buildSubjects);
        Object.keys(subjects.value).forEach((subjectId) => {
          const subject = subjects.value[subjectId];
          subjectIdBySlugIndex[subject.slug] = subjectId;
        });
      }
      return subjects.value;
    });
  };
  const getSubjectById = async (subject_id) => {
    await getSubjects();
    return subjects.value[subject_id] ?? null;
  };
  const getSubjectsById = async (subject_ids) => {
    await getSubjects();
    return Object.values(subjects.value).filter((subject) =>
      subject_ids.includes(subject.id)
    );
  };
  const getSubjectBySlug = async (slug) => {
    await getSubjects();
    const subjectId = subjectIdBySlugIndex[slug] ?? null;
    if (subjectId && subjectId in subjects.value) {
      return subjects.value[subjectId];
    }
    return null;
  };

  const getTypes = async () => {
    return await asyncManager.execute("getTypes", async () => {
      if (types.value === null) {
        const results = await fetchAll(API_ENDPOINT + "types");
        const buildTypes = {};
        Object.keys(results).forEach((key) => {
          const result = results[key];
          buildTypes[result.id] = result;
        });
        types.value = buildTypes;
      }
    });
  };
  const getTypeById = async (type_id) => {
    await getTypes();
    return types.value[type_id] ?? null;
  };
  const getTypesById = async (type_ids) => {
    await getTypes();
    return Object.values(types.value).filter((type) =>
      type_ids.includes(type.id)
    );
  };

  const getExamboards = async () => {
    return await asyncManager.execute("getExamboards", async () => {
      if (examboards.value === null) {
        let buildExamboards = {};
        let results = await fetchAll(API_ENDPOINT + "examboards");
        Object.keys(results).forEach((key) => {
          const result = results[key];
          buildExamboards[result.id] = result;
        });
        examboards.value = buildExamboards;
      }
      return examboards.value;
    });
  };
  const getExamboardById = async (examboard_id) => {
    await getExamboards();
    return examboards.value[examboard_id] ?? null;
  };

  const getBundles = async () => {
    return asyncManager.execute("getBundles", async () => {
      if (bundles.value === null) {
        let buildBundles = {};
        let results = await fetchAll(API_ENDPOINT + "bindles");
        Object.keys(results).forEach((key) => {
          const result = results[key];
          const bookIds = [];
          result.books.forEach((book) => bookIds.push(book.id));
          // there's not much point in presenting a bundle with no books!
          if (bookIds.length > 0) {
            // replace the slug since those from the database/API suck
            result.slug = Util.snakeCase(result.title);
            result["book_ids"] = bookIds;
            buildBundles[result.id] = result;
          }
        });
        bundles.value = buildBundles;
        //console.log('bundles', bundles.value);
        await precalculateBundlesIndexes(bundles.value);
      }
      return bundles.value;
    });
  };
  const getBundleById = async (bundle_id) => {
    await getBundles();
    return bundles.value[bundle_id] ?? null;
  };
  const getBundleBySlug = async (slug) => {
    await getBundles();
    const bundleId = bundleIdBySlugIndex[slug] ?? null;
    if (bundleId && bundleId in bundles.value) {
      return bundles.value[bundleId];
    }
    return null;
  };

  const getBooks = async () => {
    return asyncManager.execute("getBooks", async () => {
      if (books.value === null) {
        await getLevels();
        await getSubjects();
        await getTypes();
        const buildBooks = {};
        if (OBTAIN_BOOKS_FROM_LEVELS) {
          Object.values(levels.value).forEach((level) => {
            Object.values(level.books).forEach((levelBook) => {
              levelBook.subject_ids = [];
              levelBook.type_ids = [];
              buildBooks[levelBook.id] = levelBook;
            });
          });

          Object.values(subjects.value).forEach((subject) => {
            Object.values(subject.books).forEach((subjectBook) => {
              const bookId = subjectBook.id;
              if (bookId in buildBooks) {
                buildBooks[bookId].subject_ids.push(subject.id);
              } else {
                subjectBook.type_ids = [];
                subjectBook.subject_ids = [subject.id];
                buildBooks[bookId] = subjectBook;
              }
            });
          });

          Object.values(types.value).forEach((type) => {
            if ("books" in type) {
              Object.values(type.books).forEach((typeBook) => {
                const bookId = typeBook.id;
                if (bookId in buildBooks) {
                  buildBooks[bookId].type_ids.push(type.id);
                } else {
                  typeBook.type_ids = [type.id];
                  typeBook.subject_ids = [];
                  buildBooks[bookId] = typeBook;
                }
              });
            }
          });
        } else {
          const results = await fetchAll(API_ENDPOINT + "books");
          Object.values(results).forEach((key) => {
            let book = results[key];
            buildBooks[book.id] = book;
          });
        }
        const bookIds = Object.keys(buildBooks);
        for (let idx = 0; idx < bookIds.length; idx++) {
          const book = buildBooks[bookIds[idx]];
          const level = await getLevelById(book.level_id);
          const subjects = await getSubjectsById(book.subject_ids);
          if (subjects.length > 1) {
            book.product_url = "/" + level.slug + "/subjects/" + book.slug;
          } else if (subjects.length === 1) {
            book.product_url =
              "/" + level.slug + "/" + subjects[0].slug + "/" + book.slug;
          } else {
            books.product_url = null;
          }
        }

        books.value = buildBooks;
        await precalculateBookIndexes(books.value);
        return books.value;
      }
    });
  };
  const getBookById = async (book_id) => {
    await getBooks();
    return books.value[book_id] ?? null;
  };
  const getBooksById = async (book_ids) => {
    await getBooks();
    return book_ids.reduce((accumulator, id) => {
      if (id in books.value) {
        accumulator[id] = books.value[id];
      }
      return accumulator;
    }, {});
  };
  const getBookBySlug = async (slug) => {
    await getBooks();
    const bookId = bookIdBySlugIndex[slug] ?? null;
    if (bookId && bookId in books.value) {
      return books.value[bookId];
    }
    return null;
  };
  const getBookUrl = async (book_id) => {
    const book = await getBookById(book_id);
    const level = await getLevelById(book.level_id);
    const subjects = await getSubjectsById(book.subject_ids);
    if (subjects.length > 1) {
      return "/" + level.slug + "/subjects/" + book.slug;
    } else {
      return "/" + level.slug + "/" + subjects[0].slug + "/" + book.slug;
    }
  };

  const fetchBookBySlug = async (slug) => {
    // the API data is an f***ing pickle ... it gets back different properties if i get it from different places 🤷
    await getBooks();
    const bookId = bookIdBySlugIndex[slug] ?? null;
    if (!bookId) return null;
    const book = books.value[bookId];
    if ("discounts" in book) {
      return book;
    }
    const result = await fetchOne(API_ENDPOINT + "books/" + bookId);
    const fetchedBook = result.data;
    book.bundles = fetchedBook.bindles;
    book.discounts = fetchedBook.discounts;
    return book;
  };

  const getPrioritisedSubjectsIndex = async () => {
    await getSubjects();
    return Object.entries(subjects.value)
      .sort(([, dataA], [, dataB]) => dataA.priority - dataB.priority)
      .map(([id]) => id);
  };

  // temporarily mimic data that should probably come from the API/db!
  const tempAdjustSubjects = (subjects) => {
    Object.values(subjects).forEach((subject) => {
      switch (subject["slug"]) {
        case "maths":
          subject["image_url"] = "/assets/subjects/mathematics.png";
          subject["priority"] = 1;
          break;
        case "english-language":
          subject["image_url"] = "/assets/subjects/english-language.png";
          subject["priority"] = 2;
          break;
        case "english-literature":
          subject["image_url"] = "/assets/subjects/english-literature.png";
          subject["priority"] = 2;
          break;
        case "chemistry":
          subject["image_url"] = "/assets/subjects/chemistry.png";
          subject["priority"] = 3;
          break;
        case "physics":
          subject["image_url"] = "/assets/subjects/physics.png";
          subject["priority"] = 3;
          break;
        case "biology":
          subject["image_url"] = "/assets/subjects/biology.png";
          subject["priority"] = 3;
          break;
        case "history":
          subject["image_url"] = "/assets/subjects/history.png";
          subject["priority"] = 3;
          break;
        case "geography":
          subject["image_url"] = "/assets/subjects/geography.png";
          subject["priority"] = 3;
          break;
        case "dt":
          subject["image_url"] = "/assets/subjects/business-studies.png";
          subject["priority"] = 3;
          break;
        default:
          subject["image_url"] = null;
          subject["priority"] = 4;
          break;
      }
    });
    return subjects;
  };

  const precalculateBookIndexes = async (books) => {
    await getLevels();
    Object.values(books).forEach((book) => {
      let level = levels.value[book.level_id];
      if (!(level in bookIdByLevelIndex)) {
        bookIdByLevelIndex[level.id] = [];
      }
      bookIdByLevelIndex[level.id].push(book.id);
      bookIdBySlugIndex[book.slug] = book.id;
      bookIdBySubjectIndex[book.subject_id] = book.id;
      if (book.is_featured) {
        featuredBookIds.push(book.id);
      }
      // todo: bookIdByLevelSubjectIndex
    });
  };

  const precalculateBundlesIndexes = async (bundles) => {
    await getLevels();
    await getBooks();
    Object.values(bundles).forEach((bundle) => {
      Object.values(bundle.book_ids).forEach((book_id) => {
        const book = books.value[book_id];
        const level = levels.value[book.level_id];
        if (!(level.id in bundleIdByLevelIndex)) {
          bundleIdByLevelIndex[level.id] = [];
        }
        if (!bundleIdByLevelIndex[level.id].includes(bundle)) {
          bundleIdByLevelIndex[level.id].push(bundle.id);
        }
        if ("subject_ids" in book) {
          book.subject_ids.forEach((subject_id) => {
            bundleIdBySubjectIndex[subject_id] = bundle.id;
          });
        }
        bundleIdBySlugIndex[bundle.slug] = bundle.id;
      });
    });
  };

  const getPopularBundles = async (
    count,
    is_core = null,
    level_slug = null,
    subject_slug = null
  ) => {
    return getRandomBundles(count, is_core, level_slug, subject_slug);
  };

  const getBestsellingBundles = async (level_slug = null) => {
    await getBundles();
    await getLevels();
    if (!level_slug) {
      throw "not yet supported!";
    }
    if (!(level_slug in levelIdBySlugIndex)) {
      //console.log(levelIdBySlugIndex);
      console.error("Failed to find level id for level slug=" + level_slug);
      return [];
    }
    const buildBundles = [];
    const level_id = levelIdBySlugIndex[level_slug];
    //const level = levels.value[level_id];
    //console.log(bundleIdByLevelIndex[level_id]);
    bundleIdByLevelIndex[level_id].forEach((bundleId) => {
      buildBundles.push(bundles.value[bundleId]);
    });
    //console.log(buildBundles);
    return buildBundles;
  };

  const getRandomBundles = async (
    count,
    is_core = null,
    level_slug = null,
    subject_slug = null
  ) => {
    await getBundles();

    //console.log('bundles',bundles.value);
    let bundlesArray;
    if (is_core === null && level_slug === null && subject_slug === null) {
      bundlesArray = Object.values(bundles.value);
    } else {
      bundlesArray = Object.values(bundles.value).filter((bundle) => {
        if (is_core !== null) {
          if (is_core === true) {
            if (bundle.is_core_bundle === "No") {
              return false;
            }
          } else {
            if (bundle.is_core_bundle === "Yes") {
              return false;
            }
          }
        } else if (level_slug !== null) {
          const level_id = levelIdBySlugIndex[level_slug];
          if (!bundle.books.some((book) => book.level_id === level_id)) {
            return false;
          }
        } else if (
          subject_slug !== null &&
          subject_slug in bundleIdByLevelIndex
        ) {
          const subject_id = subjectIdBySlugIndex[subject_slug];
          if (
            !bundle.books.some((book) => book.subject_ids.includes(subject_id))
          ) {
            return false;
          }
        }
        return true;
      });
    }
    //console.log('bundlesArray', bundlesArray);
    if (bundlesArray.length < count) {
      //console.log('whoops!');
      return bundlesArray; // whoops
    }
    return Util.getRandom(bundlesArray, count);
  };

  const getFeaturedBooks = async (
    count,
    level_id = null,
    subject_id = null
  ) => {
    await getBooks();
    let booksArray = Object.values(books.value).filter(
      (book) =>
        (book.is_featured &&
          (level_id === null || book.level_id === level_id)) ||
        subject_id === null ||
        book.subject_ids.includes(subject_id)
    );
    return Util.getRandom(booksArray, count);
  };

  const getPopularBooks = async (count, level_id = null, subject_id = null) => {
    await getBooks();
    let booksArray = Object.values(books.value);
    if (level_id !== null) {
      booksArray = booksArray.filter(
        (book) => book.level_id !== null && book.level_id === level_id
      );
    }
    if (subject_id !== null) {
      booksArray = booksArray.filter(
        (book) =>
          book.subject_id !== null && book.subject_ids.includes(subject_id)
      );
    }
    return Util.getRandom(booksArray, count);
  };

  const getRandomBooks = async (count) => {
    await getBooks();
    const booksArray = Object.values(books.value);
    return Util.getRandom(booksArray, count);
  };

  const getLevelBySlug = async (slug) => {
    await getLevels();
    if (slug in levelIdBySlugIndex) {
      const levelId = levelIdBySlugIndex[slug];
      return levels.value[levelId];
    }
    return null;
  };

  const addSubscriber = async (emailAddress) => {
    try {
      const data = { email: emailAddress };
      await axios.post(`${API_ENDPOINT}subscribe`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (err) {
      //throw "Add subscriber doesn't yet have an API endpoint!";
      console.error("Add subscriber doesn't yet have an API endpoint!");
      return false;
    }
  };

  const getSubjectIconClass = (slug) => {
    switch (slug) {
      case "spanish":
        return "fa-skull-cow";
      case "physics":
        return "fa-telescope";
      case "maths":
        return "fa-calculator";
      case "chemistry":
        return "fa-flask";
      case "dt":
        return "fa-drafting-compass";
      case "french":
        return "fa-cheese";
      case "biology":
        return "fa-dna";
      case "drama":
        return "fa-theater-masks";
      case "geography":
        return "fa-globe";
      case "german":
        return "fa-sausage";
      case "history":
        return "fa-scroll-old";
      case "computer-science":
        return "fa-desktop";
      case "music":
        return "fa-music";
      case "english-language":
        return "fa-language";
      case "english-literature":
        return "fa-book";
      default:
        return "fa-image";
    }
  };

  return {
    getHomepageData,
    getBooks,
    getBooksById,
    getBookById,
    getBookBySlug,
    fetchBookBySlug,
    getBookUrl,
    getBundles,
    getBundleById,
    getBundleBySlug,
    getBestsellingBundles,
    getSubjects,
    getSubjectById,
    getSubjectsById,
    getSubjectBySlug,
    getTypes,
    getTypeById,
    getTypesById,
    getLevels,
    getLevelById,
    getLevelBySlug,
    getExamboards,
    getExamboardById,
    getPopularBooks,
    getFeaturedBooks,
    getPopularBundles,
    getPrioritisedSubjectsIndex,
    getRandomBundles,
    getRandomBooks,
    addSubscriber,
    getSubjectIconClass,
    subjects,
    types,
    levels,
    examboards,
    books,
    bundles,
    featuredBookIds,
    bookIdBySlugIndex,
    routingFailed,
  };
});
