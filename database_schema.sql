-- UUIDs use gen_random_uuid() (built into PostgreSQL 13+)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    email_verification_token VARCHAR(255) NULL,
    email_verification_expires TIMESTAMP WITH TIME ZONE NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Virtual Machines Table
CREATE TABLE IF NOT EXISTS virtual_machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'stopped', 'suspended', 'maintenance', 'creating', 'destroying', 'error')),
    os_type VARCHAR(20) NOT NULL CHECK (os_type IN ('windows', 'linux')),
    os_version VARCHAR(50),
    cpu_cores INTEGER NOT NULL CHECK (cpu_cores > 0),
    ram_mb INTEGER NOT NULL CHECK (ram_mb > 0),
    storage_gb INTEGER NOT NULL CHECK (storage_gb > 0),
    ip_address INET NULL,
    mac_address VARCHAR(17) NULL,
    vnc_port INTEGER NULL,
    spice_port INTEGER NULL,
    proxy_address VARCHAR(255) NULL,
    proxy_port INTEGER NULL,
    template_id UUID NULL REFERENCES virtual_machines(id) ON DELETE SET NULL,
    node_name VARCHAR(100) NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes for VMs
CREATE INDEX IF NOT EXISTS idx_virtual_machines_user_id ON virtual_machines(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_machines_status ON virtual_machines(status);
CREATE INDEX IF NOT EXISTS idx_virtual_machines_os_type ON virtual_machines(os_type);
CREATE INDEX IF NOT EXISTS idx_virtual_machines_created_at ON virtual_machines(created_at);
CREATE INDEX IF NOT EXISTS idx_virtual_machines_node_name ON virtual_machines(node_name);

-- Monitoring Metrics Table (TimescaleDB ready)
CREATE TABLE IF NOT EXISTS monitoring_metrics (
    time TIMESTAMPTZ NOT NULL,
    vm_id UUID NOT NULL REFERENCES virtual_machines(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    host_id UUID NULL,
    metadata JSONB DEFAULT '{}'
);

-- Create hypertable for time-series data (run separately after table creation)
-- SELECT create_hypertable('monitoring_metrics', 'time',
--     partitioning_column => 'vm_id',
--     number_of_partitions => 4,
--     chunk_time_interval => INTERVAL '24 hours');

-- Indexes for monitoring metrics
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_vm_id_time ON monitoring_metrics(vm_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_metric_type ON monitoring_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_host_id ON monitoring_metrics(host_id) WHERE host_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_time ON monitoring_metrics(time);

-- Compression policy (for older data)
-- ALTER TABLE monitoring_metrics SET (
--     timescaledb.compress,
--     timescaledb.compress_segmentby = 'vm_id,metric_type',
--     timescaledb.compress_orderby = 'time DESC'
-- );

-- Add compression policy (run after table is populated)
-- SELECT add_compression_policy('monitoring_metrics', INTERVAL '7 days');

-- Retention policy (keep 2 years of data)
-- SELECT add_retention_policy('monitoring_metrics', INTERVAL '2 years');

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vm_id UUID NULL REFERENCES virtual_machines(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    metric_type VARCHAR(50) NOT NULL,
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('gt', 'lt', 'gte', 'lte', 'eq')),
    threshold_value DOUBLE PRECISION NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 1),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    enabled BOOLEAN DEFAULT TRUE,
    notification_channels JSONB DEFAULT '["email", "in_app"]',
    last_triggered TIMESTAMP WITH TIME ZONE NULL,
    trigger_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_vm_id ON alerts(vm_id);
CREATE INDEX IF NOT EXISTS idx_alerts_enabled ON alerts(enabled) WHERE enabled = TRUE;
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_metric_type ON alerts(metric_type);

-- Alert Notifications Table
CREATE TABLE IF NOT EXISTS alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    value_at_trigger DOUBLE PRECISION NOT NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE NULL,
    acknowledged_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE NULL,
    resolved_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    notification_sent JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for alert notifications
CREATE INDEX IF NOT EXISTS idx_alert_notifications_alert_id ON alert_notifications(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_triggered_at ON alert_notifications(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_acknowledged_at ON alert_notifications(acknowledged_at) WHERE acknowledged_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_alert_notifications_resolved_at ON alert_notifications(resolved_at) WHERE resolved_at IS NOT NULL;

-- Backup Records Table
CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vm_id UUID NOT NULL REFERENCES virtual_machines(id) ON DELETE CASCADE,
    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('full', 'incremental', 'snapshot')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
    size_bytes BIGINT DEFAULT 0,
    location VARCHAR(255) NULL,
    encryption_key_id UUID NULL,
    compression_ratio DOUBLE PRECISION NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    retention_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verification_status VARCHAR(20) NULL CHECK (verification_status IN ('pending', 'verified', 'failed')),
    verification_attempts INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for backups
CREATE INDEX IF NOT EXISTS idx_backups_vm_id ON backups(vm_id);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);
CREATE INDEX IF NOT EXISTS idx_backups_started_at ON backups(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_backups_retention_expires_at ON backups(retention_expires_at);
CREATE INDEX IF NOT EXISTS idx_backups_backup_type ON backups(backup_type);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NULL,
    details JSONB,
    ip_address INET NULL,
    user_agent TEXT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON audit_log(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_id ON audit_log(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_success ON audit_log(success);

-- Insert default admin user (password: Admin123! - CHANGE IN PRODUCTION)
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified)
VALUES (
    'admin@cloudhosting.com',
    '$2a$12$7vX8J.Z0Q6b1y.Y6Z8Z7OeY6R8uY7Z8y.Y6Z8Z7OeY6R8uY7Z8y.Y',
    'System',
    'Administrator',
    'super_admin',
    'active',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Refresh tokens (used by backend/src/auth/auth.service.js)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- Password reset tokens (migration 003)
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_resets_token_hash ON password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
