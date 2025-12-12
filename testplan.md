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
| **SEARCH-003** | Should filter by battery system on SRP (5 variations) | `tests/productsearch.spec.ts` |
| **SEARCH-004** | Should show "No Results Found" for a non-existent product | `tests/productsearch.spec.ts` |

## 📦 Product Details Page (PDP)

| Test ID | Description | File |
| :--- | :--- | :--- |
| **PDP-001** | Should display essential product information on the PDP | `tests/productpdp.spec.ts` |
| **PDP-002** | Should open "Where to Buy" or Dealer Locator from PDP | `tests/productpdp.spec.ts` |
| **PDP-003** | Should validate technical specification section content | `tests/productpdp.spec.ts` |
| **PDP-004** | Verify related accessories section (cross-selling) | `tests/productpdp-accessories.spec.ts` |

## 🛠️ Service & Support

| Test ID | Description | File |
| :--- | :--- | :--- |
| **SERVICE-001** | Verify the Tool Repair landing page is accessible | `tests/service-repair.spec.ts` |
| **SERVICE-002** | Verify the Dealer Locator map loads | `tests/service-dealerlocator.spec.ts` |
## 📍 Store Locator

| Test ID | Description | File |
| :--- | :--- | :--- |
| **STORE-001** | Verify "Where to Buy" page loads and map/list container is present | `tests/store_locator.spec.ts` |

## 🛡️ Warranty & Manuals

| Test ID | Description | File |
| :--- | :--- | :--- |
| **WARRANTY-001** | Verify "Product Warranty" page loads and displays warranty categories | `tests/service_warranty.spec.ts` |
| **MANUAL-001** | Verify "Manuals and Part Diagrams" page is accessible | `tests/service_warranty.spec.ts` |
| **REPAIR-001** | Verify "Start a Repair" link points to repair order page | `tests/service_warranty.spec.ts` |

---

## 📊 Test Summary

- **Total Test Suites**: 9
- **Total Test Cases**: 18 (including 5 SEARCH-003 variations)
- **Categories Covered**: Navigation, Search, Product Details, Service & Support, Store Locator, Warranty

*Note: Test IDs are used where available in the test title.*
