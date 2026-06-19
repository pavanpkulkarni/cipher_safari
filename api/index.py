from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        input_payload = json.loads(post_data.decode('utf-8'))
        
        raw_database = os.environ.get("SAFARI_DATABASE")
        
        if not raw_database:
            current_dir = os.path.dirname(__file__)
            manifest_path = os.path.join(current_dir, 'safari_manifest.json')
            if os.path.exists(manifest_path):
                with open(manifest_path, 'r') as file:
                    database = json.load(file)
            else:
                database = {"puzzles": []}
        else:
            database = json.loads(raw_database)
            
        level_id = input_payload.get("level")                     
        player_season = input_payload.get("season_index")          
        player_hour = input_payload.get("shadow_hour")             
        player_vine = input_payload.get("vine_color")              
        player_socket = input_payload.get("socket_id")             
        
        puzzle = next((p for p in database.get("puzzles", []) if p["id"] == level_id), None)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if not puzzle:
            response = {"status": "error", "message": f"Level {level_id} missing from manifest."}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
            
        is_season_correct = (player_season == puzzle["target_season_index"])
        is_hour_correct = (player_hour == puzzle["target_shadow_hour"])
        is_circuit_correct = (player_vine == puzzle["required_vine_color"] and player_socket == puzzle["target_nest_id"])
        
        if is_season_correct and is_hour_correct and is_circuit_correct:
            output_payload = {
                "status": "unlocked",
                "message": f"SUCCESS: Celestial tracking coordinates stabilized for Level {level_id}.",
                "target_animal": puzzle["animal"],
                "target_socket": puzzle["target_nest_id"],
                "animation_trigger": "play_reveal_sequence"
            }
        else:
            faults = []
            if not is_season_correct: faults.append("Macro-Rotor Alignment Corrupted (Weather Mismatch)")
            if not is_hour_correct: faults.append("Micro-Rotor Calibration Drift (Shadow Offset Mismatch)")
            if not is_circuit_correct: faults.append("Plugboard Terminal Grounding Fault (Incorrect Vine Routing)")
            
            output_payload = {
                "status": "scrambled",
                "message": "DECRYPTION CODE FAILED: Stream contains static noise.",
                "fault_logs": faults,
                "animation_trigger": "play_static_flicker"
            }
            
        self.wfile.write(json.dumps(output_payload).encode('utf-8'))
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
