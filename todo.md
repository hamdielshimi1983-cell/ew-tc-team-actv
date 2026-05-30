# Marketing Request Management Platform - Enhanced with EW-TC Logic

## Phase 1: PIN-Based Authentication & Role Management

- [ ] Add PIN login system (replace OAuth temporarily or add as option)
- [ ] Create predefined users: Hamdi (admin), Hadeer (media_buyer), Bakr (creator), Asmaa (creator)
- [ ] Implement PIN verification in login page
- [ ] Add role-based access control: admin, media_buyer, creator
- [ ] Restrict dashboard views based on user role

## Phase 2: Enhanced Creative Approval Workflow

- [ ] Update request status pipeline: Pending → Approved → Published → Closed
- [ ] Add "Return" action with mandatory feedback comment (manager only)
- [ ] Add "Returned" status for rejected creatives
- [ ] Implement manager approval queue view
- [ ] Add "Green Light" indicator for published posts on dashboard
- [ ] Display manager comments to creators when returned

## Phase 3: Media Buyer Dashboard & Budget Tracking

- [ ] Create Media Buyer dashboard showing only "Approved" requests
- [ ] Add "Publish" button for approved requests
- [ ] Add "Back for Update" and "Closed" status options for media buyer
- [ ] Create Campaign Command Center with budget tracking
- [ ] Implement CPL (Cost Per Lead) health monitoring
- [ ] Add color-coded budget health: Green (healthy), Amber (approaching limit), Red (kill-switch)
- [ ] Create daily spend report form for media buyer

## Phase 4: Brief Board & Activity Auditing

- [ ] Add Brief Board module for campaign briefs
- [ ] Implement brief creation with user assignment
- [ ] Add "Seen" acknowledgment button with timestamp
- [ ] Create brief status pipeline: Draft → Published → Seen → In Progress → Submitted → Done
- [ ] Build Global Activity Log tracking all system actions
- [ ] Log creative uploads, approvals, returns, publications
- [ ] Add async standup form (3 questions: yesterday, today, blockers)

## Phase 5: Bilingual UI & Design Polish

- [ ] Add Arabic translations for all UI labels and buttons
- [ ] Keep numbers, analytics, and enums in English
- [ ] Add language toggle (Arabic/English)
- [ ] Apply clean SaaS aesthetic with bento grids
- [ ] Add "Back" button to all inner pages
- [ ] Ensure professional spacing and subtle shadows

## Phase 6: Testing & Deployment

- [ ] Run TypeScript checks
- [ ] Write vitest tests for new procedures
- [ ] Run production build
- [ ] Smoke test all user flows
- [ ] Deploy to Manus
