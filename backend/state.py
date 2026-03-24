import uuid
import time
import random
from datetime import datetime

class SystemState:
    def __init__(self):
        self.devices = [
            {
                "id": str(uuid.uuid4()),
                "ip": "192.168.1.10",
                "mac": "00:1A:2B:3C:4D:5E",
                "vendor": "Apple Inc.",
                "type": "Laptop",
                "trustScore": 98,
                "status": "trusted", # trusted, suspicious, threat, blocked
                "activity": 5, # Simulated bandwidth usage
                "isCore": False
            },
            {
                "id": str(uuid.uuid4()),
                "ip": "192.168.1.15",
                "mac": "A1:B2:C3:D4:E5:F6",
                "vendor": "Samsung Electronics",
                "type": "Smartphone",
                "trustScore": 95,
                "status": "trusted",
                "activity": 2,
                "isCore": False
            },
            {
                "id": "core-router-01",
                "ip": "192.168.1.1",
                "mac": "FF:FF:FF:FF:FF:FF",
                "vendor": "Cisco Systems",
                "type": "Router",
                "trustScore": 100,
                "status": "trusted",
                "activity": 50,
                "isCore": True
            }
        ]
        self.logs = []
        self.firewall_config = "Default Block"
        self.ips_profile = "Strict Enforce"
        self.ddos_mode = "Auto-Mitigate"
        self.geo_block = "Level 2 (High)"
        self.add_log("System initialized. Network monitoring active.", "INFO")

    def get_devices(self):
        # Apply Aggressive IPS Auto-Blocking
        if self.ips_profile == "Aggressive":
            for d in self.devices:
                if d['status'] == 'threat':
                    d['status'] = 'blocked'
                    d['activity'] = 0
                    d['trustScore'] = 0
                    self.add_log(f"IPS AUTO-DEFENSE: Actively blocked threat at {d['ip']}", "SUCCESS")
        return self.devices

    def get_logs(self):
        # Return tail of logs (last 50)
        return self.logs[-50:]

    def get_stats(self):
        active_threats = sum(1 for d in self.devices if d['status'] == 'threat')
        blocked_devices = sum(1 for d in self.devices if d['status'] == 'blocked')
        return {
            "totalDevices": len(self.devices),
            "threatLevel": "High" if active_threats > 0 else "Low",
            "activeThreats": active_threats,
            "blockedDevices": blocked_devices
        }

    def add_log(self, message, level="INFO"):
        self.logs.append({
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "message": message,
            "level": level
        })

    def add_suspicious_device(self):
        # Determine status based on current firewall mode
        status = "suspicious"
        
        # Geo-Block Strict Isolate instantly blocks new unrecognized IPs
        if self.geo_block == "Strict Isolate":
            status = "blocked"
            self.add_log(f"GEO-FENCE: Injection blocked. Strict isolate enforced.", "SUCCESS")
        elif self.firewall_config == "Permissive":
            status = "unprotected"
        elif self.firewall_config in ["Zero-Trust", "Lockdown"]:
            status = "threat"

        new_device = {
            "id": str(uuid.uuid4()),
            "ip": f"192.168.1.{random.randint(50, 200)}",
            "mac": f"{random.randint(10,99)}:XX:YY:ZZ:AA:BB",
            "vendor": "Unknown Vendor",
            "type": "Unknown",
            "trustScore": 45 if status != "threat" else 12,
            "status": status,
            "activity": 12,
            "isCore": False
        }
        self.devices.append(new_device)
        return new_device

    def trigger_attack(self, device_id):
        for device in self.devices:
            if device['id'] == device_id:
                # DDoS Mitigation Defense
                if self.ddos_mode == "Always-On":
                    self.add_log(f"DDOS SHIELD: Volumetric attack from {device['ip']} absorbed and deflected.", "SUCCESS")
                    return True # Simulated attack absorbed

                device['trustScore'] = 12
                device['status'] = 'threat'
                device['activity'] = 98 # Spike in activity
                self.add_log(f"CRITICAL: Port scan detected from {device['ip']}", "CRITICAL")
                self.add_log(f"CRITICAL: High traffic volume identified from {device['ip']}", "CRITICAL")
                return True
        return False

    def execute_action(self, device_id, action):
        for device in self.devices:
            if device['id'] == device_id:
                if action == 'block':
                    device['status'] = 'blocked'
                    device['activity'] = 0
                    device['trustScore'] = 0
                    self.add_log(f"ACTION: Device {device['ip']} has been BLOCKED.", "SUCCESS")
                elif action == 'allow':
                    device['status'] = 'trusted'
                    device['trustScore'] = 80
                    self.add_log(f"ACTION: Device {device['ip']} has been marked as TRUSTED.", "SUCCESS")
                return True
        return False

    def reset(self):
        # Keep only the original 3 devices
        self.devices = [d for d in self.devices if d['id'] in ['core-router-01'] or d['vendor'] != 'Unknown Vendor']
        # Clear logs except the first one
        if len(self.logs) > 0:
            self.logs = [self.logs[0]]
        self.firewall_config = "Default Block"
        self.add_log("System reset to steady state.", "SUCCESS")
        return True

    def update_config(self, key, value):
        if key == "firewallMode":
            self.firewall_config = value
            # Dynamically update existing unknown devices
            for d in self.devices:
                if d['vendor'] == "Unknown Vendor" and d['status'] != "blocked":
                    if value == "Permissive":
                        d['status'] = 'unprotected'
                    elif value in ["Zero-Trust", "Lockdown"]:
                        d['status'] = 'threat'
                        d['trustScore'] = 12
                    else:
                        d['status'] = 'suspicious'
                        d['trustScore'] = 45
        elif key == "ipsProfile":
            self.ips_profile = value
        elif key == "ddosMode":
            self.ddos_mode = value
        elif key == "geoBlock":
            self.geo_block = value

        return True
