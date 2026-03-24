from flask import Flask, jsonify, request
from flask_cors import CORS
from state import SystemState

app = Flask(__name__)
CORS(app)  # Enable CORS for the React frontend

# Initialize mock system state
state = SystemState()

@app.route('/api/network/state', methods=['GET'])
def get_network_state():
    """Return the entire network state."""
    return jsonify({
        "devices": state.get_devices(),
        "logs": state.get_logs(),
        "stats": state.get_stats()
    })

@app.route('/api/demo/inject-suspicious', methods=['POST'])
def inject_suspicious():
    """Demo trigger: Inject an unknown device into the network."""
    new_device = state.add_suspicious_device()
    state.add_log(f"ALERT: Unknown device connected ({new_device['ip']})", "WARNING")
    return jsonify({"status": "success", "device": new_device})

@app.route('/api/demo/trigger-attack', methods=['POST'])
def trigger_attack():
    """Demo trigger: Simulate an attack from a specific device."""
    data = request.json
    device_id = data.get("deviceId")
    if not device_id:
        return jsonify({"status": "error", "message": "deviceId required"}), 400
    
    success = state.trigger_attack(device_id)
    if success:
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Device not found"}), 404

@app.route('/api/demo/reset', methods=['POST'])
def reset_demo():
    """Demo trigger: Reset the system to remove mock injected devices."""
    state.reset()
    return jsonify({"status": "success"})

@app.route('/api/demo/log', methods=['POST'])
def add_demo_log():
    """Add a custom system log from the UI."""
    data = request.json
    message = data.get("message")
    level = data.get("level", "INFO")
    if message:
        state.add_log(message, level)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 400

@app.route('/api/demo/config', methods=['POST'])
def update_demo_config():
    """Update global simulation configuration."""
    data = request.json
    key = data.get("key")
    value = data.get("value")
    if key and value:
        state.update_config(key, value)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 400

@app.route('/api/device/<device_id>/action', methods=['POST'])
def device_action(device_id):
    """Handle allow/block actions for a device."""
    data = request.json
    action = data.get("action")  # 'allow' or 'block'
    
    if action not in ['allow', 'block']:
        return jsonify({"status": "error", "message": "Invalid action"}), 400
        
    success = state.execute_action(device_id, action)
    if success:
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Device not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
