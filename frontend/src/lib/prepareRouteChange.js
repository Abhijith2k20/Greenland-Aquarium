/** Unpin / restore DOM before React route unmounts (no-op if ScrollTrigger unused). */
export function prepareRouteChange() {
  // Intentionally empty — sticky FeaturedFish no longer uses GSAP ScrollTrigger.
  // Kept as a stable hook for route transitions / future scroll cleanup.
}
