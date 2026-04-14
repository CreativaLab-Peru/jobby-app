-- Allow multiple roadmaps per route.
-- We still keep uniqueness per opportunity+cv+user+route via roadmap_opportunityId_cvId_userId_routeId_key.
DROP INDEX IF EXISTS "roadmap_routeId_key";
