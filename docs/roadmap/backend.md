# Roadmap — Backend

> **Short codes:** **B1** = this section (API maturity). **B2** = next section (security & reliability). Same labels as [status.md](status.md).

## 3) Backend Phase 1 (**B1**) - API Maturity and Consistency

### Goals

- Stabilize API contract quality for real client consumption.
- Standardize error handling and request/response behavior.
- Ensure documentation and tests match actual behavior.

### Workstreams

1. API Contract
   - Confirm endpoints and payloads under `/api/v1`.
   - Keep OpenAPI spec aligned with implementation.
   - Add request/response examples for key endpoints.

2. Validation and Error Model
   - Standardize on **RFC 7807 Problem Details** (`application/problem+json`) where appropriate for Spring.
   - Normalize validation and business errors into one predictable shape.
   - Keep HTTP status usage strict and predictable.
   - Document all known error cases in README/OpenAPI.

3. Query Behavior
   - Add/standardize pagination for list endpoints.
   - Add simple filtering/sorting only if needed (YAGNI).

4. Test Coverage
   - Keep unit tests focused on use cases.
   - Keep controller tests focused on contract + status + payload.
   - Keep one integration flow proving core happy-path.

### Definition of Done (Phase 1)

- OpenAPI and runtime behavior match.
- Error responses follow Problem Details (or documented equivalent) consistently.
- Test suite passes locally with Gradle and Java 25.
- README includes API usage examples.

---

## 4) Backend Phase 2 (**B2**) - Security and Reliability

### Goals

- Raise production-readiness for auth and service resilience.
- Keep architecture clean without overengineering.

### Workstreams

1. Security Hardening
   - Define endpoint authorization matrix (public/user/admin).
   - Standardize auth error responses (`401`, `403`, `422` where relevant).
   - **Target auth model for SPA:** short-lived **access token** (kept in memory on the client) and **refresh token** in an **HttpOnly, Secure, SameSite** cookie; backend exposes refresh (and optional rotation). Avoid persisting access tokens in `localStorage` / `sessionStorage` as the default.
   - If an interim step keeps Bearer-only headers, document TTL, risks, and the migration path to cookie-based refresh.
   - Review secret configuration and actuator exposure in non-local profiles.

2. Reliability Patterns
   - Keep outbox flow observable and auditable.
   - Add pragmatic retry/timeout/circuit-breaker only where real failure exists.
   - Ensure dead-letter/retry behavior is documented.

3. Observability Quality
   - Confirm useful logs per endpoint and key domain action.
   - Keep metrics tied to business flow (commands, failures, lag).
   - Verify alert behavior and expected delay windows.

4. Operational Readiness
   - Validate Docker behavior and restart expectations.
   - Keep health endpoints and probes aligned with runtime behavior.

### Definition of Done (Phase 2)

- Security matrix implemented and tested.
- Reliability behavior validated with at least one failure simulation.
- Alerts and logs are actionable and documented.
- Backend is stable enough for frontend integration.

---

[← Overview](overview.md) · [Frontend →](frontend.md)
