# Homepage Module

This module handles the homepage functionality for the SimpliCollect application.

## Features

### 1. Statistics API
- **Endpoint**: `GET /api/homepage/statistics`
- **Description**: Returns cached statistics including total chapters, members, and formatted transaction amounts
- **Caching**: Data is cached for 30 minutes and automatically refreshed
- **Number Formatting**: Large amounts are formatted in Indian number system (k, L, Cr)
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "totalChapters": 15,
    "totalMembers": 150,
    "totalAmount": "₹5.0L",
    "totalAmountRaw": "5023325"
  },
  "cached": true,
  "cacheAge": 5
}
```

### 2. Newsletter Subscription API
- **Endpoint**: `POST /api/homepage/newsletter`
- **Description**: Allows users to subscribe to the newsletter
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response Format**:
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

### 3. Cache Management APIs (Utility)
- **Clear Cache**: `DELETE /api/homepage/cache/statistics`
- **Cache Status**: `GET /api/homepage/cache/status`

## Database Schema

### Newsletter Subscribers Table
```sql
CREATE TABLE newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT TRUE,
  unsubscribedAt TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_subscribed_at (subscribedAt),
  INDEX idx_is_active (isActive)
);
```

## Caching Strategy

- **Cache Duration**: 30 minutes
- **Auto Refresh**: Cron job runs every 30 minutes to refresh cache
- **Manual Refresh**: Cache can be manually cleared via API
- **Fallback**: If cache is stale, fresh data is fetched from database

## File Structure

```
src/homepage/
├── controller/
│   └── homepageController.js    # API controllers
├── model/
│   └── homepageModel.js         # Database operations
├── route/
│   └── homepageRoutes.js        # Route definitions
├── cron/
│   └── statisticsCache.js       # Caching and cron jobs
└── README.md                    # Documentation

src/utility/
└── numberFormatter.js           # Number formatting utilities
```

## Number Formatting

The application uses Indian number system formatting for large amounts:

- **Thousands**: 1,500 → ₹1.5k
- **Lakhs**: 1,50,000 → ₹1.5L
- **Crores**: 1,50,00,000 → ₹1.5Cr

### Formatting Examples:
- 500 → ₹500
- 1,200 → ₹1.2k
- 12,000 → ₹12k
- 1,20,000 → ₹1.2L
- 12,00,000 → ₹12L
- 1,20,00,000 → ₹1.2Cr
- 50,23,325 → ₹50L

The formatter also provides raw values for calculations if needed.

## Usage Examples

### Frontend Integration
```javascript
// Fetch statistics
const response = await fetch('/api/homepage/statistics');
const data = await response.json();

// Subscribe to newsletter
const subscribeResponse = await fetch('/api/homepage/newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'user@example.com' })
});
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Installation

1. Run the newsletter table creation SQL:
```sql
-- Execute the SQL from: SQL queries/newsletter_table.sql
```

2. The module is automatically loaded when the server starts through app.js

## Performance Considerations

- Statistics are cached to reduce database load
- Email validation prevents invalid newsletter subscriptions
- Database indexes optimize query performance
- Cron jobs run in background without blocking the main thread
