-- PostgreSQL Init Script
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS public;
ALTER USER invoiceflow WITH SUPERUSER;
SELECT 'PostgreSQL initialized for InvoiceFlow' AS status;
