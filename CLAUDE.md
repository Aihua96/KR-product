# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with auto-open browser
- `npm run build` - Build for production (runs prebuild validation first)
- `npm run preview` - Preview production build locally

### Content Generation & Validation
- `npm run prebuild` - Run all validation and generation scripts before build
- `npm run generate:glossary` - Generate glossary from `<Term>` tags in markdown files
- `npm run generate:products:matrix` - Update product matrix from data/products.json
- `npm run generate:solutions:meta` - Generate solutions metadata
- `npm run validate:products` - Validate product data schema and consistency
- `npm run validate:quick-links` - Validate product quick links configuration
- `npm run validate:readme` - Validate README.md structure
- `npm run check:anchors` - Check legacy anchor points exist

### CI/Build Validation
- `npm run ci:check` - Run glossary integrity check and build (for CI)

## Project Architecture

This is a **VitePress v2** documentation site for KR (瞰融信息) products with sophisticated content generation and validation systems.

### Core Structure
```
/
├── .vitepress/           # VitePress configuration and custom theme
│   ├── config.ts         # Main configuration with bilingual setup
│   └── theme/            # Custom Vue components and styling
├── data/
│   └── products.json     # Single source of truth for product information
├── scripts/              # Build-time generation and validation scripts
├── public/               # Static assets and generated JSON files
├── [product-dirs]/       # Product documentation (krvirt, krcmp, etc.)
├── solutions/            # Solution documentation
└── en/                   # English placeholder structure
```

### Key Features
- **Bilingual Support**: Chinese (root) with English placeholder structure at `/en/`
- **Dynamic Components**: Vue components for product matrices, quick links, and glossaries
- **Content Generation**: Automated glossary, product matrix, and metadata generation
- **Validation Pipeline**: Comprehensive validation of data integrity and link consistency

### Product Data Flow
1. **Source**: `data/products.json` contains all product metadata
2. **Generation**: Scripts generate `public/products.json` and static markdown tables
3. **Components**: Vue components consume generated JSON for dynamic functionality
4. **Validation**: Multiple validation scripts ensure data consistency

### Custom Components
- `ProductMatrix.vue` - Interactive product comparison table with filtering/sorting
- `ProductQuickLinks.vue` - Product-specific navigation shortcuts  
- `ProductStatusBar.vue` - Product overview with version/status badges
- `Term.vue` - Inline terminology definitions (feeds glossary generation)
- `FilterToolbar.vue` - Reusable filtering UI for lists and matrices

### Content Generation System
The build process automatically:
1. Validates all data schemas and consistency
2. Generates glossaries from `<Term>` markdown tags
3. Updates product matrices and quick links
4. Checks legacy anchor points for backward compatibility
5. Validates README structure and external links

### Development Workflow
1. Modify content in markdown files or `data/products.json`
2. Use `<Term name="..." desc="...">` tags for glossary entries
3. Run `npm run dev` for live preview
4. Scripts auto-generate supporting files during `prebuild`
5. All validation must pass before successful build

### Legacy Compatibility
- Hidden anchor points maintain backward compatibility for old URLs
- `ignoreDeadLinks` in config.ts allows placeholder content during development
- Validation scripts ensure required anchors exist in deployment guides

## Important Notes
- Never edit generated files in `public/` directly - they're overwritten by scripts
- Product data changes require updating `data/products.json` only
- All validation scripts must pass for successful builds
- The prebuild step is critical and runs automatically before `npm run build`