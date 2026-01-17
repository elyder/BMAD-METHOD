Runtime ReferenceError



useParams is not defined
src/app/edit-session/[id]/page.tsx (12:18) @ EditSessionPage


  10 | export default function EditSessionPage() {
  11 |   const router = useRouter();
> 12 |   const params = useParams();
     |                  ^
  13 |   const sessionId = params.id as string;
  14 |
  15 |   const { session, loading, error } = useSession(sessionId);
Call Stack
13

Show 12 ignore-listed frame(s)
EditSessionPage
src/app/edit-session/[id]/page.tsx (12:18)Runtime ReferenceError



useParams is not defined
src/app/edit-session/[id]/page.tsx (12:18) @ EditSessionPage


  10 | export default function EditSessionPage() {
  11 |   const router = useRouter();
> 12 |   const params = useParams();
     |                  ^
  13 |   const sessionId = params.id as string;
  14 |
  15 |   const { session, loading, error } = useSession(sessionId);
Call Stack
13

Show 12 ignore-listed frame(s)
EditSessionPage
src/app/edit-session/[id]/page.tsx (12:18)


C:\Users\Kunde\Documents\GitHub\BMAD-METHOD\interval-timer-web>npm run dev

> interval-timer-web@0.1.0 dev
> next dev

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of 
C:\Users\Kunde\package-lock.json as the root directory.       
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.       
 Detected additional lockfiles: 
   * C:\Users\Kunde\Documents\GitHub\BMAD-METHOD\interval-timer-web\package-lock.json
   * C:\Users\Kunde\Documents\GitHub\BMAD-METHOD\package-lock.json

▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000     
- Network:       http://192.168.10.140:3000

✓ Starting...
⚠ Turbopack's filesystem cache has been deleted because we previously detected an internal error in Turbopack. Builds or page loads may be slower as a result.
✓ Ready in 1652ms
○ Compiling / ...
 GET / 200 in 6.5s (compile: 6.1s, render: 463ms)
 GET /edit-session/1768590597309 200 in 1691ms (compile: 1631ms, render: 60ms)
