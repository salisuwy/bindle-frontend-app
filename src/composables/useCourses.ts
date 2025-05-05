import { useQuery } from '@tanstack/vue-query';
import { apiClient } from './axiosClient';

import type { Subject, Examboard, Level } from './useBindleData';
import { consoleLog } from '@/components/helpers/tsUtils';

export type Course = {
  id: number;
  name: string;
  subject: Subject;
  examboard: Examboard;
  level: Level;
};

export const useCourses = () => {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 8 * 60 * 60 * 1000,
    queryFn: async () => {
      const resp = await apiClient.get<{ courses: { data: Course[] } }>('courses?limit=999999');
      return resp.data.courses.data;
    },
  });

  const attachMultipleCourses = async (params: any) => {
    await apiClient
      .post(`courses/attach-multiple`, params)
      .then((data) => {
        consoleLog('Attached data', data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  const tokeniseTerm = (searchTerm: string) => {
    return searchTerm
      .toLowerCase()
      .split(/[,\.:;\(\)\s]+/)
      .filter((t) => t.length > 0);
  };

  const calculateMatchScore = (searchTokens: string[], courseTokens: string[]) => {
    const nonFullMatchedTokens = searchTokens.filter(
      (searchToken) => !courseTokens.includes(searchToken)
    );
    const fullMatches = searchTokens.length - nonFullMatchedTokens.length;
    const partialMatches = nonFullMatchedTokens.filter((searchToken) =>
      courseTokens.some((courseToken) => courseToken.includes(searchToken))
    ).length;
    return fullMatches + partialMatches * 0.5;
  };

  const searchCourses = (searchTerm: string, maxResults = 8) => {
    if (courses.value === undefined) {
      return [];
    }

    const searchTokens = tokeniseTerm(searchTerm);

    const filteredCourses = courses.value.flatMap((course) => {
      const courseTokens = tokeniseTerm(course.name);
      const matchScore = calculateMatchScore(searchTokens, courseTokens);

      if (matchScore === 0) {
        return [];
      } else {
        return [{ matchScore, course }];
      }
    });

    const rankedCourses = filteredCourses.sort((a, b) => b.matchScore - a.matchScore);

    return rankedCourses.slice(0, maxResults).map(({ course }) => course);
  };

  return { courses, isLoading, attachMultipleCourses, searchCourses };
};
