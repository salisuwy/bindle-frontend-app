import { defineStore } from 'pinia';
import { ref } from 'vue';

import { consoleLog } from '@/components/helpers/tsUtils';

//https://pinia.vuejs.org/core-concepts/#Setup-Stores
export const useBindleOldStore = defineStore('bindle', () => {
  const CACHE_TIME_SECS = 86400; // 1 day in seconds
  const SECRET_TOKEN = 'jn34toip3nkges0';

  const books = ref(null);
  const bundles = ref(null);
  const examboards = ref(null);
  const levels = ref(null);
  const subjects = ref(null);
  const types = ref(null);
  const popularBundles = ref(null);
  const bookByLevelIds = ref({});
  const invalidateTs = ref(Date.now() + CACHE_TIME_SECS);
  const routingFailed = ref(false);

  const checkInvalidate = () => {
    if (invalidateTs.value < Date.now()) {
      books.value = null;
      bundles.value = null;
      examboards.value = null;
      levels.value = null;
      subjects.value = null;
      types.value = null;
      popularBundles.value = null;
      bookByLevelIds.value = {};
      invalidateTs.value = Date.now() + CACHE_TIME_SECS;
    }
  };

  const getData = async (request, dataRef) => {
    checkInvalidate();
    if (dataRef.value) {
      return dataRef.value;
    }

    const response = await fetch(`http://bindle.local/api.php?request=${request}`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + SECRET_TOKEN,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    dataRef.value = await response.json();
    return dataRef.value;
  };

  const postData = async (request, data) => {
    try {
      let response = await fetch(`http://bindle.local/api.php?request=${request}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          Authorization: 'Token ' + SECRET_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        consoleLog('bad response code=' + response.status);
        return 'There was a problem processing your request';
      }
    } catch (exc) {
      consoleLog('fetch error', exc);
      return 'There was a problem processing your request';
    }
  };

  const getBooks = async () => {
    return getData('books', books);
  };

  const getBundles = async () => {
    return getData('bundles', bundles);
  };

  const getExamboards = async () => {
    return getData('examboards', examboards);
  };

  const getLevels = async () => {
    return getData('levels', levels);
  };

  const getSubjects = async () => {
    return getData('subject', subjects);
  };

  const getTypes = async () => {
    return getData('types', types);
  };

  const addSubscriber = (emailAddress) => {
    return postData('add-subscriber', { email: emailAddress });
  };

  const getBookLevelIds = async () => {
    if (Object.keys(bookByLevelIds.value).length > 0) {
      return bookByLevelIds.value;
    }
    const books = await getBooks();
    const levelsArray = Object.values(await getLevels());
    levelsArray.forEach((level) => {
      bookByLevelIds.value[level['slug']] = [];
    });
    Object.keys(books).forEach((book_id) => {
      levelsArray.forEach((level) => {
        if (books[book_id]['level_slug'] === level['slug']) {
          bookByLevelIds.value[level['slug']].push(book_id);
        }
      });
    });
    return bookByLevelIds.value;
  };

  const getBundlesWithBooks = async () => {
    const books = await getBooks();
    const bundles = await getBundles();
    const bundlesWithBooks = [];
    Object.keys(bundles).forEach((bindleIdx) => {
      const bundle = bundles[bindleIdx];
      const bundleWithBooks = {
        name: bundle['name'],
        books: {},
      };
      let retailPriceTotal = 0;
      let discountTotal = 0;
      bundle['book_ids'].forEach((bookId) => {
        const book = books[bookId];
        bundleWithBooks.books[bookId] = book;
        retailPriceTotal += parseFloat(book['retail_price']);
        discountTotal += 15;
      });
      let discount = discountTotal / bundle['book_ids'].length / 100;
      let discountMultiplier = 1 - discount;
      bundleWithBooks['price'] = retailPriceTotal.toFixed(2);
      bundleWithBooks['discount'] = Math.floor(discount * 100);
      bundleWithBooks['discountPrice'] = (retailPriceTotal * discountMultiplier).toFixed(2);
      bundleWithBooks['type'] = bundle['type'];
      bundlesWithBooks.push(bundleWithBooks);
    });
    return bundlesWithBooks;
  };

  const getPopularBundles = async (count) => {
    // since this isn't yet a thing just get some random ones
    const bundlesWithBooks = await getBundlesWithBooks();
    const results = [];
    const bundleNames = [];
    let idx = 0;
    let bailCount = 0;
    while (idx < count && bailCount < 50) {
      let bundleIdx = Math.floor(Math.random() * bundlesWithBooks.length);
      let bundleWithBooks = bundlesWithBooks[bundleIdx];
      if (!bundleNames.includes(bundleWithBooks['name'])) {
        results.push(bundleWithBooks);
        bundleNames.push(bundleWithBooks['name']);
        idx++;
      } else {
        bailCount++;
      }
    }
    return results;
  };

  const getRandomBundleByType = async (type) => {
    if (!['core', 'workbook'].includes(type)) {
      throw "Valid types are 'core' and 'workbook'";
    }
    const bundlesWithBooks = await getBundlesWithBooks();
    let bailCount = 0;
    while (bailCount < 50) {
      let bundleIdx = Math.floor(Math.random() * bundlesWithBooks.length);
      let bundleWithBooks = bundlesWithBooks[bundleIdx];
      if (type === 'core') {
        if (bundleWithBooks['type'].indexOf('core') !== -1) {
          return bundleWithBooks;
        }
      } else {
        if (bundleWithBooks['type'].indexOf('core') === -1) {
          return bundleWithBooks;
        }
      }
      bailCount++;
    }
    return null;
  };

  const getPopularBooks = async (count) => {
    // since this isn't yet a thing just get some random ones
    const books = await getBooks();
    const bookIds = Object.keys(books);
    const results = [];
    const hasBookIds = [];
    let idx = 0;
    let bailCount = 0;
    while (idx < count && bailCount < 50) {
      const bookIdx = Math.floor(Math.random() * bookIds.length);
      const bookId = bookIds[bookIdx];
      const book = books[bookId];
      if (!hasBookIds.includes(bookId)) {
        results.push(book);
        hasBookIds.push(bookId);
        idx++;
      } else {
        bailCount++;
      }
    }
    return results;
  };

  const getRandomBooks = async (levelSlug, count) => {
    const bookLevelIds = await getBookLevelIds();
    const books = await getBooks();
    if ((!levelSlug) in bookLevelIds) {
      throw "level not found '" + levelSlug + "'";
    }
    let bookIds = bookLevelIds[levelSlug];
    // bookIds.forEach((bookId)  => {
    //     if (!(bookId in books)) {
    //         console.error('failed to find book id='+bookId);
    //     }
    // })
    const resultIds = [];
    let idx = 0;
    let bailCount = 0;
    while (idx < count && bailCount < 50) {
      let bookId = Math.floor(Math.random() * bookIds.length);
      if (bookId in books && !resultIds.includes(bookId)) {
        resultIds.push(bookId);
        idx++;
      } else {
        bailCount++;
      }
    }
    let results = [];
    resultIds.forEach((id) => {
      results.push(books[id]);
    });
    return results;
  };

  return {
    books,
    getBooks,
    getRandomBooks,
    getPopularBooks,
    bundles,
    getBundlesWithBooks,
    getPopularBundles,
    getRandomBundleByType,
    examboards,
    getExamboards,
    levels,
    getLevels,
    subjects,
    getSubjects,
    types,
    getTypes,
    addSubscriber,
    routingFailed,
  };
});
