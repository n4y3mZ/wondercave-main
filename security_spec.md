# Firestore Security Specification

## 1. Data Invariants
1. A user document `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. Users cannot elevate their own role to 'admin'; only existing admins or initialization default allows role modification.
3. The `/pages/{slug}` collection represents public research pages. Read access is open to all users (public knowledge base). Writes/updates are restricted to authenticated admins or researchers.
4. Lab progress `/users/{userId}/progress/{labSlug}` belongs strictly to `request.auth.uid == userId`.
5. Every write operation must respect property type boundaries and string length constraints.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated User Profile Creation**: Anonymous attempt to write `/users/test-uid` -> DENIED.
2. **ID Spoofing on User Profile**: Authenticated user `uid_A` attempting to write `/users/uid_B` -> DENIED.
3. **Ghost Property Injection**: Attempting to inject extra unverified admin flags `__superAdmin: true` -> DENIED.
4. **Unauthorized Page Mutation**: Unauthenticated user trying to delete or overwrite `/pages/sql-injection` -> DENIED.
5. **Non-Admin Page Write**: Regular user attempting to mutate `/pages/sql-injection` -> DENIED.
6. **Path Traversal / Junk ID**: Writing to an invalid ID path like `/users/..%2F..%2Fhack` -> DENIED.
7. **Resource Poisoning (Oversized Payload)**: Inserting a 50MB string into user profile -> DENIED.
8. **Lab Progress Theft**: User A writing lab completion to `/users/UserB/progress/csrf` -> DENIED.
9. **Lab Progress Read Eavesdropping**: User A querying User B's `/users/UserB/progress` -> DENIED.
10. **Arbitrary Collection Write**: Writing to root collection `/system_secrets` -> DENIED (default deny).
11. **Spoofed Email Update**: Updating email without valid auth -> DENIED.
12. **Null Resource Read**: Reading private user data unauthenticated -> DENIED.

## 3. Rules Verification Plan
Rules will be tested against these invariants with helper functions `isValidId()`, `isSignedIn()`, and ownership guards.
