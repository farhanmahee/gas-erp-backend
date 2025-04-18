# Disaster Recovery Playbook: Cylinder Tracking System

## 1. Introduction

This playbook outlines procedures to recover from failures in the cylinder tracking system, which is critical to the gas distribution ERP. The tracking system encompasses RFID/NFC digital twins, IoT sensors, blockchain records, and inventory management components.

## 2. Failure Scenarios

### 2.1 RFID/NFC Subsystem Failure

| Severity | Detection Method | Impact | MTTR Target |
|----------|------------------|--------|-------------|
| Critical | Monitoring alerts, field reports | Unable to scan/identify cylinders, field operations halted | <30 minutes |

#### Recovery Procedure

1. **Immediate Actions**:
   - Activate offline scanning mode in mobile applications
   - Alert field teams to use barcode/manual entry as backup
   - Notify all stakeholders via emergency communication channel

2. **Diagnostic Steps**:
   - Check RFID service status and logs
   - Verify network connectivity to RFID middleware
   - Check database connection status
   - Inspect recent deployments or configuration changes

3. **Recovery Steps**:
   - Restart RFID service (if software issue)
   - Roll back to last known good deployment if recent changes caused the issue
   - Restore RFID database from latest backup if data corruption detected
   - Activate standby RFID service in secondary region if primary region issue

4. **Verification**:
   - Perform test scans at multiple locations
   - Verify data synchronization between offline cache and central database
   - Confirm system alerts are cleared

5. **Post-Recovery**:
   - Synchronize offline transactions with central database
   - Reconcile any inventory discrepancies
   - Document incident and conduct root cause analysis

### 2.2 IoT Telemetry System Failure

| Severity | Detection Method | Impact | MTTR Target |
|----------|------------------|--------|-------------|
| High | Monitoring alerts, data reception gaps | Loss of real-time cylinder condition data, safety monitoring degraded | <45 minutes |

#### Recovery Procedure

1. **Immediate Actions**:
   - Activate backup polling service for critical cylinders
   - Enable edge processing mode on IoT gateways to queue readings
   - Notify safety team to perform manual checks for high-risk locations

2. **Diagnostic Steps**:
   - Check telemetry ingestion service status
   - Verify message broker (Kafka/RabbitMQ) health
   - Check TimescaleDB connection and status
   - Inspect network connectivity with IoT gateways

3. **Recovery Steps**:
   - Restart telemetry processing services
   - Scale up message broker capacity if queue backlog detected
   - Restore TimescaleDB from backup if data corruption found
   - Redeploy IoT service if software issue detected

4. **Verification**:
   - Confirm data flow from multiple sensor sources
   - Verify recent telemetry data appears in dashboards
   - Check alert system functionality

5. **Post-Recovery**:
   - Process backlogged data from edge gateways
   - Run consistency check on cylinder status records
   - Update digital twins with latest state

### 2.3 Blockchain Ownership Tracking Failure

| Severity | Detection Method | Impact | MTTR Target |
|----------|------------------|--------|-------------|
| High | Transaction failure alerts, consensus issues | Unable to record or verify cylinder ownership transfers | <60 minutes |

#### Recovery Procedure

1. **Immediate Actions**:
   - Switch to contingency transaction log (append-only database)
   - Notify operations team to use manual approval for cylinder transfers
   - Pause automated deposit processing

2. **Diagnostic Steps**:
   - Check blockchain node status
   - Verify network connectivity between nodes
   - Inspect smart contract execution logs
   - Check for blockchain fork or consensus issues

3. **Recovery Steps**:
   - Restart blockchain nodes if unresponsive
   - Resynchronize nodes if consensus issues detected
   - Deploy backup smart contracts if contract failure detected
   - Restore from latest blockchain backup if corruption detected

4. **Verification**:
   - Execute test transactions
   - Verify consensus across multiple nodes
   - Confirm historical transaction accessibility

5. **Post-Recovery**:
   - Reconcile contingency transaction log with blockchain
   - Execute any pending ownership transfers
   - Update customer records with correct ownership status

### 2.4 Database Corruption (Cylinder Records)

| Severity | Detection Method | Impact | MTTR Target |
|----------|------------------|--------|-------------|
| Critical | Integrity check failures, application errors | Inaccurate inventory, potential safety risks, business disruption | <45 minutes |

#### Recovery Procedure

1. **Immediate Actions**:
   - Activate read-only mode for cylinder database
   - Switch application to use read replicas
   - Notify warehouse operations to pause cylinder movements

2. **Diagnostic Steps**:
   - Check database error logs
   - Run database integrity checks
   - Identify extent of corruption (tables/records affected)
   - Determine corruption timeframe

3. **Recovery Steps**:
   - If corruption is limited:
     - Restore affected tables from last backup
     - Apply transaction logs to reach point just before corruption
   - If widespread corruption:
     - Restore full database from last known good backup
     - Apply transaction logs up to point just before corruption
   - Execute data reconciliation procedures with backup sources (IoT, blockchain)

4. **Verification**:
   - Run database integrity checks
   - Verify sample cylinder records for accuracy
   - Test critical workflows

5. **Post-Recovery**:
   - Reconcile inventory with physical count
   - Update any records that changed between backup and corruption
   - Generate exception reports for manual verification

### 2.5 Complete System Outage

| Severity | Detection Method | Impact | MTTR Target |
|----------|------------------|--------|-------------|
| Critical | Monitoring alerts, service unavailability | Complete inability to track cylinders, business operations halted | <90 minutes |

#### Recovery Procedure

1. **Immediate Actions**:
   - Activate business continuity plan
   - Deploy emergency communication to all stakeholders
   - Activate manual tracking procedures (paper-based)

2. **Diagnostic Steps**:
   - Check infrastructure status (network, compute, storage)
   - Verify database availability
   - Check for security incidents
   - Assess external dependency status

3. **Recovery Steps**:
   - If infrastructure issue:
     - Activate disaster recovery environment in alternate region
     - Restore from latest backups
     - Redirect traffic to DR environment
   - If application issue:
     - Roll back to last known good deployment
     - Restart application services in sequence per dependency order
     - Restore data if necessary

4. **Verification**:
   - Verify end-to-end functionality through test transactions
   - Check data consistency across all subsystems
   - Confirm external integrations are working

5. **Post-Recovery**:
   - Reconcile offline transactions
   - Audit cylinder locations and status
   - Document lessons learned and update recovery procedures

## 3. Preventive Measures

### 3.1 Real-time Monitoring

| Component | Metrics Monitored | Alert Threshold | Responsible Team |
|-----------|-------------------|-----------------|------------------|
| RFID Service | Scan success rate, API response time, Error rate | <98% success, >200ms, >1% errors | IoT Team |
| Telemetry Service | Message processing rate, Queue depth, Data gap detection | <1800 msgs/min, >2000 queued, >5 min gap | IoT Team |
| Blockchain Service | Transaction success rate, Block creation time, Node consensus | <99% success, >30s delay, <66% consensus | Blockchain Team |
| Database | Replication lag, Query performance, Corruption checks | >10s lag, >2x baseline time, Any corruption | DBA Team |
| Application Services | CPU/Memory usage, Error rates, Request latency | >80% usage, >0.1% errors, >2x baseline | DevOps Team |

### 3.2 Backup Strategy

| Data Type | Backup Method | Frequency | Retention | Verification |
|-----------|---------------|-----------|-----------|--------------|
| Cylinder Records | Full + Incremental | Full: Daily, Incremental: Hourly | 90 days | Weekly restore test |
| Transaction Logs | Continuous archiving | Real-time | 90 days | Daily validation |
| Blockchain Ledger | Node replication + Snapshot | Real-time + Daily snapshot | 7 years | Monthly integrity check |
| IoT Telemetry | TimescaleDB continuous backup | Continuous | 1 year (aggregated: 7 years) | Weekly sample verification |
| Configuration | Git repository + Config snapshots | On change | All versions | Pre-deployment validation |

### 3.3 Resilience Features

- **Data Redundancy**: Triple replication for critical data across multiple availability zones
- **Graceful Degradation**: Services designed to operate with reduced functionality during partial outages
- **Circuit Breakers**: Automatic isolation of failing components to prevent cascade failures
- **Chaos Testing**: Regular simulated failure testing in staging environment
- **Automatic Failover**: Database and service failover without manual intervention
- **Offline Capability**: Mobile applications designed to function without connectivity for up to 24 hours

## 4. Recovery Team Structure

### 4.1 First Response Team

- **Incident Commander**: Coordinates overall response, makes critical decisions
- **Technical Lead**: Directs technical recovery efforts
- **Communications Officer**: Provides updates to stakeholders
- **Operations Specialist**: Handles business continuity measures

### 4.2 Specialized Support

- **Database Administrator**: Handles database recovery
- **Network Engineer**: Resolves connectivity issues
- **Security Specialist**: Addresses any security-related aspects
- **Application Developer**: Resolves application-specific issues
- **IoT Specialist**: Handles sensor and device issues
- **Blockchain Engineer**: Manages blockchain recovery

### 4.3 Escalation Path

| Level | Time to Escalate | Contacts | Authorization Level |
|-------|------------------|----------|---------------------|
| Level 1 | Initial response | On-call engineer | Restart services, basic recovery |
| Level 2 | After 15 minutes if unresolved | Technical Lead, Team Manager | Service rollback, database recovery |
| Level 3 | After 30 minutes if unresolved | CTO, VP of Engineering | DR activation, emergency procedures |
| Level 4 | After 60 minutes if unresolved | CEO, Executive Team | Business contingency activation |

## 5. Communication Plan

### 5.1 Internal Communication

| Audience | Channel | Frequency | Content |
|----------|---------|-----------|---------|
| Recovery Team | Emergency Slack channel | Every 15 minutes | Technical details, recovery status |
| Operations Staff | SMS + Email + Internal Portal | Initial + Every 30 minutes | Operational impact, workarounds |
| Management | SMS + Conference bridge | Initial + Every 30 minutes | Business impact, estimated resolution |
| All Employees | Email + Intranet | Initial + Major updates | General status, business continuity info |

### 5.2 External Communication

| Audience | Channel | Frequency | Content |
|----------|---------|-----------|---------|
| Customers | Customer Portal + Email | Initial + Every 60 minutes | Service status, estimated resolution |
| Suppliers | Email + Phone | Initial + Major updates | Delivery/pickup impacts, contingency plans |
| Regulators | Official communication + Phone | As required by regulations | Incident details, safety assurances |
| Public | Website status page | Initial + Major updates | General service status |

## 6. Recovery Testing and Drills

### 6.1 Testing Schedule

| Test Type | Frequency | Participants | Success Criteria |
|-----------|-----------|--------------|------------------|
| Component Failure | Monthly | Technical teams | Recovery within 50% of MTTR target |
| Regional Failover | Quarterly | All recovery teams | Full functionality in DR environment |
| Full System Outage | Biannually | All staff | Business operations continue with minimal disruption |
| Data Corruption | Quarterly | DBA team, Application team | Full data recovery with <0.1% loss |
| Table-top Exercise | Monthly | Recovery team leaders | Correct decision-making and escalation |

### 6.2 Drill Evaluation

After each drill, document:

- Actual recovery time vs. target
- Procedural gaps or errors
- Communication effectiveness
- Unexpected complications
- Recommended procedure updates

## 7. Compliance and Documentation

### 7.1 Required Documentation

| Document | Content | Update Frequency | Approver |
|----------|---------|------------------|----------|
| Incident Report | Detailed timeline, actions taken, root cause | After each incident | CTO |
| Recovery Metrics | MTTR, data loss, business impact | Monthly | VP of Operations |
| Procedure Updates | Changes to recovery procedures | After changes | Technical Lead + CTO |
| Drill Reports | Results, findings, recommendations | After each drill | Security Officer |
| Risk Assessment | Updated risk profile based on incidents | Quarterly | Risk Management Team |

### 7.2 Regulatory Requirements

- Bangladesh Explosives Act 1884: Document all cylinder-related incidents
- BGMEA safety standards: Report recovery metrics for safety-critical systems
- Industry standards: Maintain ISO 27001 compliance for information security

## 8. Recovery Resources

### 8.1 Tools and Systems

| Tool | Purpose | Access Method | Responsible Team |
|------|---------|---------------|------------------|
| Monitoring Dashboard | Real-time system status | <https://monitor.gas-erp.com> | DevOps Team |
| Incident Management System | Track recovery activities | <https://incident.gas-erp.com> | Operations Team |
| DR Environment | Backup production environment | VPN + special credentials | Infrastructure Team |
| Backup Management Console | Access and restore backups | Secure admin portal | DBA Team |
| Emergency Inventory System | Offline cylinder tracking | Standalone application | Warehouse Team |

### 8.2 Documentation Access

| Document | Location | Access Method | Offline Availability |
|----------|----------|---------------|---------------------|
| Recovery Procedures | Documentation Portal | Web + Mobile App | Downloaded to emergency devices |
| Contact Lists | Incident Management System | Web + Mobile App | Printed copy in emergency kit |
| System Diagrams | Architecture Repository | Web Portal | Printed copy in emergency kit |
| Credentials | Secure Password Manager | Authorized devices only | Emergency envelopes (sealed) |
| Vendor Support | Support Portal | Web + Phone numbers | Printed contact list |

## 9. Continuous Improvement

### 9.1 Post-Incident Review Process

1. Schedule review within 48 hours of incident resolution
2. Document timeline, actions, and decisions
3. Identify root causes and contributing factors
4. Develop actionable improvements
5. Assign responsibilities for implementation
6. Track completion of improvement items
7. Validate effectiveness in next drill

### 9.2 KPIs for Recovery Effectiveness

| Metric | Target | Measurement Method | Review Frequency |
|--------|--------|-------------------|------------------|
| Mean Time to Recovery | <45 minutes | Incident timestamps | Monthly |
| Recovery Success Rate | >99% | (Successful recoveries / Total incidents) | Quarterly |
| Data Loss Incidents | Zero | Count of incidents with confirmed data loss | Monthly |
| Unplanned Downtime | <0.05% | Monitoring system | Monthly |
| Incident Detection Time | <5 minutes | Time between issue start and alert | Monthly |
| Procedure Compliance | 100% | Audit of incident records | Quarterly |

## 10. Special Considerations for Cylinder Tracking

### 10.1 Safety-Critical Recovery Priorities

1. **First Priority**: Restore safety monitoring for hazardous materials
2. **Second Priority**: Recover customer-owned cylinder tracking
3. **Third Priority**: Restore internal inventory tracking
4. **Fourth Priority**: Recover historical data and analytics

### 10.2 Cylinder Reconciliation Procedure

After significant tracking system outages:

1. Generate "Last Known Good" inventory report from pre-incident data
2. Initiate emergency physical count procedure at all locations
3. Scan all cylinders with backup scanning devices
4. Upload reconciliation data to recovery database
5. Run automated discrepancy report
6. Dispatch verification teams for any unresolved discrepancies
7. Generate exception approvals for inventory adjustments
8. Update blockchain records with verified ownership information
9. Restore digital twin status from latest IoT data
10. Document all exceptions for compliance purposes
