# Prisma + Knex Setup

This project uses a hybrid approach:
- **Prisma**: For schema management and database migrations
- **Knex**: For database queries and operations

## Why This Setup?

- Prisma provides excellent schema management and migration capabilities
- Knex offers flexible query building and raw SQL support
- This allows us to leverage the best of both tools

## Database Configuration

The database connection is configured in two places:

1. **Knex**: `src/config/db.js` - Used for all database queries
2. **Prisma**: `prisma/schema.prisma` - Used for schema management

Both use the same database credentials from `.env` file.

## Common Commands

### Schema Management
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a new migration
npm run db:migrate

# Reset database (development only)
npm run db:migrate:reset

# Deploy migrations (production)
npm run db:migrate:deploy

# Pull schema from existing database
npm run db:introspect

# Open Prisma Studio to view data
npm run db:studio
```

### Development Workflow

1. **Making Schema Changes**:
   - Edit `prisma/schema.prisma`
   - Run `npm run db:migrate` to create and apply migration
   - The Prisma client will be automatically regenerated

2. **Database Queries**:
   - Use Knex for all database operations
   - Import from `src/config/db.js`
   - Continue using your existing Knex patterns

## Important Notes

- Never modify the database schema directly in MySQL
- Always use Prisma migrations for schema changes
- The Prisma client is generated to `src/generated/prisma` but we don't use it for queries
- Keep using Knex for all database operations as you currently do

## Files Structure

```
prisma/
├── schema.prisma          # Database schema definition
├── migrations/            # Migration files (auto-generated)
└── README.md             # This file

src/
├── config/
│   └── db.js             # Knex configuration (for queries)
└── generated/
    └── prisma/           # Generated Prisma client (not used for queries)
```
