# Web Component Usage Review: Library Search Page
**Date:** 2026-02-23
**Scope:** `library-search` page components (`LibrarySearchKeyword`, `LibrarySearchStored`, `LibrarySearchItem`)

## Overview
This document analyzes the current implementation of Web Components in the `library-search` page, focusing on architectural patterns, encapsulation, and adherence to web standards. While the functional implementation is solid, there are opportunities to leverage the full potential of the Web Components standard for better reusability and maintainability.

## 1. Component Roles & Separation of Concerns

### Current State
- **Encapsulation:** Functional units are well-separated (`Search`, `Stored List`, `Item`).
- **`LibrarySearchKeyword`:** Currently acts as a "God Component," handling:
  - Data fetching (API calls)
  - Infinite scroll logic (Intersection Observer)
  - DOM rendering
  - Event handling

### Recommendations
- **Split UI and Logic:** Adopt the **Container/Presentational** pattern.
  - Create a `library-list` component solely for rendering the list of items.
  - Keep `LibrarySearchKeyword` as the container that manages data fetching and passes it to `library-list`.
- **Decouple `LibrarySearchStored`:** Ensure it isn't tightly coupled to the `library-search` page's specific styles or logic, allowing it to be reused in other areas like "My Page".

## 2. Shadow DOM vs. Light DOM

### Current State
- Components render directly into the **Light DOM** using `this.innerHTML` or `this.appendChild`.
- **Pros:** Easy access to global SCSS/CSS.
- **Cons:** No style encapsulation. External styles can bleed in, and component styles can bleed out.

### Recommendations
- **Adopt Shadow DOM:** Use `this.attachShadow({ mode: 'open' })` to enforce true encapsulation.
- **Style Management:**
  - Use **Constructable Stylesheets** (`adoptedStyleSheets`) to share common styles efficiently across shadow roots.
  - Or inject `<style>` tags for component-specific CSS.
- This ensures the component looks and behaves consistently regardless of where it is used.

## 3. Attribute-Property Reflection

### Current State
- Data flow relies primarily on method calls or the event bus (`bookModel`).
- HTML attributes are underutilized for controlling component state.

### Recommendations
- **Implement Reflection:** Sync HTML attributes with JavaScript properties.
  - Example: `<library-search-item selected>` should automatically render the checked state.
- **Use `attributeChangedCallback`:** React to attribute changes instantly. This improves interoperability with other frameworks (React, Vue) or vanilla HTML usage.

## 4. Lifecycle Management

### Current State
- **Good:** Proper use of `connectedCallback` and `disconnectedCallback` for event listener management prevents memory leaks.

### Recommendations
- **Consider `adoptedCallback`:** Prepare components for scenarios where they might be moved within the DOM (e.g., drag-and-drop interfaces).

## 5. Template Optimization

### Current State
- `BaseItemComponent` parses template strings using `innerHTML`, which incurs a parsing cost on every instantiation.

### Recommendations
- **Native `<template>` Elements:** Define static HTML templates in the DOM or JS file and use `node.cloneNode(true)`. This parses HTML only once.
- **Lightweight Libraries:** Consider adopting **`lit-html`** for efficient, declarative template rendering and DOM updates without the overhead of a full framework.

## Summary
The current vanilla JS implementation is functional and demonstrates a good understanding of class-based component structure. To evolve into a robust, enterprise-grade component library, the next steps should focus on **Shadow DOM encapsulation**, **Attribute/Property synchronization**, and **optimizing template rendering**.
