import { useState, useEffect, useCallback } from "react";
import { StudentFilterParams } from "../types";

export function useStudentFilters() {
  const readFiltersFromUrl = (): StudentFilterParams => {
    if (typeof window === "undefined") {
      return { page: 1, limit: 10, sort: "createdAt:desc" };
    }
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page") || "1", 10);
    const limit = parseInt(params.get("limit") || "10", 10);
    const q = params.get("q") || "";
    const course = params.get("course") || "";
    const sort = params.get("sort") || "createdAt:desc";

    return {
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? 10 : limit,
      q: q || undefined,
      course: course || undefined,
      sort,
    };
  };

  const [filters, setFiltersState] = useState<StudentFilterParams>(readFiltersFromUrl);

  const updateUrl = useCallback((newFilters: StudentFilterParams) => {
    const params = new URLSearchParams();
    if (newFilters.page && newFilters.page > 1) {
      params.set("page", String(newFilters.page));
    }
    if (newFilters.limit && newFilters.limit !== 10) {
      params.set("limit", String(newFilters.limit));
    }
    if (newFilters.q) {
      params.set("q", newFilters.q);
    }
    if (newFilters.course) {
      params.set("course", newFilters.course);
    }
    if (newFilters.sort && newFilters.sort !== "createdAt:desc") {
      params.set("sort", newFilters.sort);
    }

    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState(null, "", newUrl);
  }, []);

  const setFilters = useCallback(
    (
      updater: Partial<StudentFilterParams> | ((prev: StudentFilterParams) => StudentFilterParams)
    ) => {
      setFiltersState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        updateUrl(next);
        return next;
      });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    const clean: StudentFilterParams = {
      page: 1,
      limit: 10,
      sort: "createdAt:desc",
    };
    updateUrl(clean);
    setFiltersState(clean);
  }, [updateUrl]);

  // Listen to popstate (browser back/forward navigation)
  useEffect(() => {
    const onPopState = () => {
      setFiltersState(readFiltersFromUrl());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
