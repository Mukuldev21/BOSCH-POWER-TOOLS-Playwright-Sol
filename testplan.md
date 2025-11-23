# 📋 Test Plan

This document outlines the automated test cases covered in the Bosch Power Tools E2E suite.

## 📱 Navigation & Layout

| Test ID | Description | File |
| :--- | :--- | :--- |
| **NAV-001** | Should load homepage, dismiss consent, and display core elements | `tests/navtest.spec.ts` |
| **NAV-002** | Verify main product category links are functional | `tests/navtest.spec.ts` |
| **NAV-003** | Verify all footer links return HTTP 200 status | `tests/navtest.spec.ts` |
| **NAV-004** | Should verify the Hamburger Menu opens and reveals navigation links | `tests/nav_mobile.spec.ts` |

## 🔍 Search Functionality

| Test ID | Description | File |
| :--- | :--- | :--- |
| **SEARCH-001** | Should search for a known product and verify the SRP loads with results | `tests/productsearch.spec.ts` |
| **SEARCH-002** | Should display auto-suggest list with relevant results for partial term | `tests/productsearch.spec.ts` |

---

*Note: Test IDs are used where available in the test title.*
