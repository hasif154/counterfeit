# BlockAuthentic Backend

Node.js + Express backend for BlockAuthentic product authentication system.

## Features

- JWT-based authentication for manufacturers
- Batch creation and PID generation
- Merkle tree generation for batch integrity
- PDF manifest generation with QR codes
- Blockchain anchoring on Polygon Mumbai
- OTT (One-Time Token) verification system
- Fraud detection (burst scans, impossible travel)
- Rate limiting and security measures

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 2. Setup

```bash
# Clone and navigate
cd backend

# Install dependencies
npm install

# Start databases
docker-compose up -d

# Copy environment file
cp .env.example .env
```

### 3. Configure Environment

Edit `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/blockauthentic
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
PORT=3001
```

### 4. Deploy Smart Contract

```bash
# Start local Hardhat node (in separate terminal)
npx hardhat node

# Deploy contract to local network
npm run deploy:local

# Copy the contract address to your .env file
```

### 5. Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
```bash
# Register manufacturer
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test Corp","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Batch Management
```bash
# Create batch (requires JWT token)
curl -X POST http://localhost:3001/api/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"sku":"SKU001","product_name":"Test Product","quantity":100}'

# Generate PIDs for batch
curl -X POST http://localhost:3001/api/batch/1/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Mark product as applied
curl -X POST http://localhost:3001/api/batch/markApplied \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"pid":"BA123456789012","operatorId":"OP001","lat":40.7128,"lon":-74.0060}'
```

### Print Confirmation
```bash
# Confirm print job
curl -X POST http://localhost:3001/api/print/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"batchId":1,"printed_roll_id":"ROLL001"}'
```

### Verification
```bash
# Get OTT for verification
curl "http://localhost:3001/api/ott?pid=BA123456789012"

# Verify product
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{"pid":"BA123456789012","ott":"uuid-from-previous-call","deviceFingerprint":"device123","lat":40.7128,"lon":-74.0060}'
```

## Architecture

### Database Schema
- `manufacturers`: Company accounts
- `batches`: Product batches with merkle roots
- `products`: Individual products with PIDs
- `scan_events`: Verification and application events
- `print_manifests`: Print job tracking

### Security Features
- JWT authentication for manufacturer routes
- Rate limiting (100 req/15min general, 5 req/min for OTT)
- Input validation and sanitization
- Single-use OTT tokens with 30s TTL
- Fraud detection algorithms

### Blockchain Integration
- Smart contract on Polygon Mumbai
- Merkle root anchoring for batch integrity
- Ethers.js for blockchain interactions

## Development

### Running Tests
```bash
# Start test environment
docker-compose up -d
npm run migrate

# Run manual tests with curl commands above
```

### Background Workers
```bash
# Run anchor worker manually
npm run anchorWorker 1  # anchors batch ID 1
```

### Database Migration
```bash
# Apply migrations (done automatically with docker-compose)
npm run migrate
```

## Production Considerations

### Security
- Use AWS KMS or similar for private key management
- Enable SSL/TLS termination
- Use environment-specific JWT secrets
- Implement proper logging and monitoring

### Scaling
- Use Redis Cluster for high availability
- Implement proper job queue (Bull, Agenda)
- Use read replicas for database
- Add caching layers

### Monitoring
- Add health checks
- Implement metrics collection
- Set up alerting for failed anchoring

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Ensure Docker containers are running: `docker-compose ps`
   - Check connection string in `.env`

2. **Contract deployment failed**
   - Ensure Hardhat node is running
   - Check private key format in `.env`

3. **OTT verification failed**
   - Check Redis connection
   - Verify OTT hasn't expired (30s TTL)

4. **Anchor worker failed**
   - Check contract address in `.env`
   - Verify network connectivity
   - Check private key has sufficient funds

### Logs
```bash
# View container logs
docker-compose logs postgres
docker-compose logs redis

# View application logs
npm run dev  # logs to console
```