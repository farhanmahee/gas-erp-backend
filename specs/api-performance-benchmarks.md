# API Performance Benchmarks

## 1. Performance Requirements

| Service | Endpoint | Max Response Time (P95) | Max Response Time (P99) | Throughput | Max Error Rate |
|---------|----------|------------------------|------------------------|------------|---------------|
| API Gateway | All Routes | 300ms | 500ms | 1000 req/s | 0.1% |
| User Service | `/api/auth/login` | 200ms | 400ms | 100 req/s | 0.01% |
| User Service | `/api/users` (CRUD) | 250ms | 450ms | 50 req/s | 0.05% |
| Cylinder Service | `/api/cylinders` (read) | 150ms | 300ms | 500 req/s | 0.01% |
| Cylinder Service | `/api/cylinders` (write) | 250ms | 400ms | 100 req/s | 0.01% |
| Inventory Service | `/api/inventory` (read) | 200ms | 350ms | 200 req/s | 0.01% |
| Inventory Service | `/api/stock-movements` (write) | 300ms | 500ms | 100 req/s | 0.01% |
| Order Service | `/api/orders` (read) | 250ms | 450ms | 100 req/s | 0.01% |
| Order Service | `/api/orders` (write) | 350ms | 550ms | 50 req/s | 0.01% |
| Payment Service | `/api/payments` (process) | 500ms | 800ms | 20 req/s | 0.001% |
| Delivery Service | `/api/deliveries` (read) | 250ms | 450ms | 100 req/s | 0.01% |
| Delivery Service | `/api/routes` (optimize) | 2000ms | 3000ms | 10 req/s | 0.05% |
| RFID Service | `/api/rfid/events` (write) | 100ms | 200ms | 1000 req/s | 0.01% |
| Telemetry Service | `/api/telemetry` (write) | 100ms | 200ms | 2000 req/s | 0.01% |
| Alert Service | `/api/alerts` (read) | 150ms | 300ms | 100 req/s | 0.01% |
| Blockchain Service | `/api/blockchain/transfers` | 1000ms | 2000ms | 10 req/s | 0.001% |

## 2. Testing Methodology

### 2.1 Testing Environments

| Environment | Infrastructure | Purpose | Data Volume |
|-------------|---------------|---------|-------------|
| Performance Lab | Dedicated Kubernetes cluster | Controlled testing | 50% of production volume |
| Staging | Production-like Kubernetes | Pre-release validation | 100% of production volume |
| Production | Production Kubernetes | Ongoing monitoring | Real production data |

### 2.2 Test Types

| Test Type | Description | Frequency | Duration |
|-----------|-------------|-----------|----------|
| Load Test | Sustained traffic at expected peak load | Weekly | 30 minutes |
| Stress Test | Traffic beyond expected peak (2x) | Monthly | 15 minutes |
| Soak Test | Sustained moderate load | Monthly | 24 hours |
| Spike Test | Sudden increase in traffic | Monthly | 10 minutes |
| Capacity Test | Increasing load until system breakdown | Quarterly | Variable |

### 2.3 Testing Tools

- **Load Generation**: Apache JMeter, k6
- **Monitoring**: Prometheus, Grafana
- **Distributed Tracing**: Jaeger
- **Log Analysis**: ELK Stack

## 3. Benchmark Scenarios

### 3.1 Cylinder Lifecycle Tracking

| Step | Endpoint | Volume | Expected Response Time |
|------|----------|--------|------------------------|
| Cylinder Registration | `/api/cylinders` (POST) | 100/hour | <250ms |
| RFID Association | `/api/rfid/tags` (POST) | 100/hour | <150ms |
| Initial Stock Entry | `/api/stock-movements` (POST) | 100/hour | <300ms |
| Digital Twin Creation | `/api/digital-twins` (POST) | 100/hour | <400ms |
| Blockchain Asset Creation | `/api/blockchain/assets` (POST) | 100/hour | <1000ms |

### 3.2 Order Processing Flow

| Step | Endpoint | Volume | Expected Response Time |
|------|----------|--------|------------------------|
| Order Creation | `/api/orders` (POST) | 50/minute | <350ms |
| Inventory Check | `/api/inventory` (GET) | 50/minute | <200ms |
| Payment Processing | `/api/payments` (POST) | 50/minute | <500ms |
| Route Planning | `/api/routes/optimize` (POST) | 5/minute | <2000ms |
| Delivery Assignment | `/api/deliveries` (POST) | 50/minute | <300ms |
| Order Status Updates | `/api/orders/{id}` (PATCH) | 100/minute | <250ms |

### 3.3 IoT Telemetry Processing

| Step | Endpoint | Volume | Expected Response Time |
|------|----------|--------|------------------------|
| Telemetry Ingestion | `/api/telemetry` (POST) | 2000/minute | <100ms |
| Anomaly Detection | `/api/telemetry/analyze` (POST) | 2000/minute | <200ms |
| Alert Generation | `/api/alerts` (POST) | 10/minute | <150ms |
| Digital Twin Update | `/api/digital-twins/{id}` (PATCH) | 2000/minute | <200ms |
| User Notification | `/api/notifications` (POST) | 10/minute | <300ms |

## 4. Database Performance

| Database | Query Type | Operation | Expected Response Time | Throughput |
|----------|------------|-----------|------------------------|------------|
| PostgreSQL | OLTP | Single-row select | <10ms | 5000 qps |
| PostgreSQL | OLTP | Multi-row select (<=100 rows) | <50ms | 1000 qps |
| PostgreSQL | OLTP | Insert/Update | <20ms | 2000 qps |
| PostgreSQL | OLAP | Aggregation (no joins) | <200ms | 100 qps |
| PostgreSQL | OLAP | Complex join (<5 tables) | <500ms | 50 qps |
| TimescaleDB | Time-series | Recent data query (1 hour) | <50ms | 1000 qps |
| TimescaleDB | Time-series | Historical data query (1 month) | <500ms | 50 qps |
| TimescaleDB | Time-series | Aggregation query | <1000ms | 20 qps |
| Redis | Cache | Get operation | <5ms | 10000 ops |
| Redis | Cache | Set operation | <5ms | 8000 ops |

## 5. Resource Utilization Targets

| Component | Resource | Normal Load | Peak Load | Threshold |
|-----------|----------|-------------|-----------|-----------|
| API Services | CPU | <30% | <70% | 80% |
| API Services | Memory | <50% | <80% | 90% |
| API Services | Network I/O | <40% | <70% | 80% |
| Database | CPU | <40% | <70% | 80% |
| Database | Memory | <60% | <85% | 90% |
| Database | Disk I/O | <30% | <70% | 80% |
| Message Broker | CPU | <30% | <60% | 70% |
| Message Broker | Memory | <50% | <75% | 85% |
| Cache | Memory | <60% | <85% | 90% |
| Cache | Network I/O | <40% | <70% | 80% |

## 6. Scaling Thresholds

| Service | Metric | Scale Out Threshold | Scale In Threshold | Min Instances | Max Instances |
|---------|--------|---------------------|-------------------|--------------|--------------|
| API Gateway | CPU | 70% | 30% | 3 | 10 |
| Core Services | CPU | 70% | 30% | 2 | 8 |
| Telemetry Service | CPU | 70% | 30% | 3 | 12 |
| Telemetry Service | Message Queue Depth | >1000 messages | <100 messages | 3 | 12 |
| Database | Connections | 80% | 40% | 1 | 5 (read replicas) |
| Message Broker | Memory | 75% | 40% | 3 | 6 |
| Cache | Memory | 70% | 40% | 3 | 6 |

## 7. Latency Budget

| Request Path | Component | Budget Allocation | Total Budget |
|--------------|-----------|-------------------|--------------|
| API Gateway → Service | Network | 10ms | 50ms |
| API Gateway → Service | API Gateway Processing | 20ms | 50ms |
| API Gateway → Service | Service Processing | 20ms | 50ms |
| Service → Database | Network | 5ms | 30ms |
| Service → Database | Query Execution | 25ms | 30ms |
| Service → Cache | Network | 2ms | 10ms |
| Service → Cache | Cache Operation | 8ms | 10ms |
| Service → Message Broker | Network | 5ms | 20ms |
| Service → Message Broker | Message Processing | 15ms | 20ms |
| Service → Service | Network | 10ms | 50ms |
| Service → Service | Service Processing | 40ms | 50ms |

## 8. Performance Optimization Strategies

### 8.1 Caching Strategy

| Data Type | Cache Type | TTL | Invalidation Strategy |
|-----------|------------|-----|------------------------|
| User Profile | Local + Distributed | 30 min | On update |
| Cylinder Data | Distributed | 5 min | On update |
| Inventory Levels | Distributed | 1 min | On update |
| Reference Data | Local + Distributed | 60 min | On update |
| Order Status | Distributed | 2 min | On update |
| Route Data | Distributed | 15 min | On update |
| Authentication Tokens | Distributed | Token lifetime | On logout |

### 8.2 Database Optimization

| Strategy | Application | Expected Improvement |
|----------|-------------|----------------------|
| Read Replicas | OLTP databases | 3x read throughput |
| Connection Pooling | All databases | 30% reduction in connection overhead |
| Query Optimization | Complex OLAP queries | 50% response time improvement |
| Indexing Strategy | All databases | 70% improvement for filtered queries |
| Table Partitioning | Time-series and historical data | 80% improvement for time-range queries |
| Data Archiving | Historical data | 40% improvement in active table performance |

### 8.3 API Optimization

| Strategy | Application | Expected Improvement |
|----------|-------------|----------------------|
| Response Compression | All services | 60% reduction in payload size |
| Pagination | List endpoints | 80% reduction in response time for large datasets |
| Field Filtering | Complex resources | 40% reduction in payload size |
| Batch Operations | Bulk updates | 70% improvement for multiple operations |
| Request Throttling | Public endpoints | Protection against abuse |
| Circuit Breaking | Inter-service communication | Failure isolation |

## 9. Benchmarking Schedule

| Test | Frequency | Owner | Reporting |
|------|-----------|-------|-----------|
| Baseline Performance | Weekly | Performance Team | Executive Dashboard |
| Load Testing | Weekly | Performance Team | Development Team |
| Stress Testing | Monthly | Performance Team | Architecture Team |
| Soak Testing | Monthly | Performance Team | Operations Team |
| Production Monitoring | Continuous | Operations Team | All Stakeholders |
| Regression Testing | Per Release | QA Team | Development Team |

## 10. Key Performance Indicators (KPIs)

| KPI | Target | Measurement Method | Reporting Frequency |
|-----|--------|-------------------|-------------------|
| API Response Time (P95) | <300ms | Application Monitoring | Real-time + Daily Report |
| API Throughput | >1000 req/s | Load Balancer Metrics | Real-time + Daily Report |
| Database Response Time | <50ms | Database Monitoring | Real-time + Daily Report |
| Error Rate | <0.1% | Application Logs | Real-time + Daily Report |
| Resource Utilization | <70% | Infrastructure Monitoring | Real-time + Daily Report |
| Availability | 99.95% | Uptime Monitoring | Daily Report |
| Release Deployment Time | <30 minutes | CI/CD Metrics | Per Release |
| Recovery Time | <15 minutes | Incident Reports | Per Incident |