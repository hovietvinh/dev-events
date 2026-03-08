<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new file): Initializes PostHog client-side using the Next.js 15.3+ recommended approach. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to support PostHog's trailing-slash API requests.
- **`components/ExploreBtn.tsx`**: Added `posthog.capture('explore_events_clicked')` inside the existing onClick handler.
- **`components/EventCard.tsx`**: Converted to a client component (`'use client'`) and added `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` via an `onClick` handler on the `<Link>`.
- **`.env.local`**: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` added (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" button on the homepage to scroll to the events section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (captures title, slug, location, date) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/333482/dashboard/1341215
- **Explore & Event Card Clicks Over Time** (daily trend): https://us.posthog.com/project/333482/insights/MguVwCoC
- **Explore → Event Card Conversion Funnel**: https://us.posthog.com/project/333482/insights/r1FfzYWN
- **Top Events by Location** (bar chart breakdown): https://us.posthog.com/project/333482/insights/dzcHpzE3
- **Most Clicked Events** (bar chart by title): https://us.posthog.com/project/333482/insights/fbD8pBqA
- **Unique Users Engaging Per Week**: https://us.posthog.com/project/333482/insights/hwreS1ud

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
