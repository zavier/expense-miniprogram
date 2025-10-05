# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WeChat Mini Program for expense splitting management. The application helps users track shared expenses in group activities (like friend gatherings) and calculate how much each person should pay or receive.

## Code Architecture

### Core Structure
- **Framework**: WeChat Mini Program (similar to React but with specific APIs)
- **Entry Point**: `app.js` - Contains global application logic and request utilities
- **Routing**: Defined in `app.json` with pages organized in `/pages` directory
- **Components**: Pages follow a 4-file structure (`.js`, `.wxml`, `.wxss`, `.json`)

### Key Pages
1. **Authentication**: `/pages/login` and `/pages/register`
2. **Ledger Management**: `/pages/ledger` (list and create)
3. **Expense Tracking**: `/pages/expense` (list and add)
4. **User Management**: Member management features

### Data Flow
- All API requests go through `app.request()` wrapper in `app.js`
- Uses JWT token authentication stored in `wx.getStorageSync('jwtToken')`
- API calls follow pattern: `/expense/[resource]/[action]`
- Error handling includes automatic redirect to login on 401 responses

### Key Utilities
- `utils/util.js` - Time formatting functions
- `app.js` - Global request handler with authentication

## Common Development Tasks

### Adding a New Page
1. Create directory in `/pages/`
2. Add four files: `.js`, `.wxml`, `.wxss`, `.json`
3. Register page in `app.json`

### Making API Calls
1. Use `app.request()` method (not direct `wx.request()`)
2. All URLs are automatically prefixed with `baseUrl` from `app.globalData`
3. Authentication headers are automatically added

### State Management
- Uses `Page.data` for component state
- Updates via `this.setData()`
- Lifecycle methods: `onLoad`, `onShow`, `onPullDownRefresh`, etc.

## Development Commands

This is a WeChat Mini Program project that runs in the WeChat Developer Tool. There are no traditional build commands like npm scripts. Development workflow:

1. Open project in WeChat Developer Tool
2. Edit files directly
3. Changes are automatically compiled and reflected in the simulator
4. Use WeChat DevTools for debugging

## Testing

Testing is done through the WeChat Developer Tool:
- Simulator for UI testing
- Console for debugging
- Network panel for API monitoring
- No automated test framework configured

## Deployment

Deployment is done through the WeChat Developer Tool:
1. Click "Upload" in the toolbar
2. Enter version number and project description
3. Submit for review in WeChat Mini Program admin panel