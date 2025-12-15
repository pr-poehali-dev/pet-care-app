'''
Аутентификация и управление пользователями Pet Life
'''
import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Telegram-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                user_id = body.get('userId')
                username = body.get('username')
                telegram_id = body.get('telegramId')
                
                cur.execute(
                    "INSERT INTO users (id, username, telegram_id) VALUES (%s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username RETURNING *",
                    (user_id, username, telegram_id)
                )
                user = cur.fetchone()
                
                cur.execute(
                    "INSERT INTO clinics (user_id, clinic_id, unlocked) VALUES (%s, 1, true) "
                    "ON CONFLICT (user_id, clinic_id) DO NOTHING",
                    (user_id,)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'userId': user_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                user_id = body.get('userId')
                
                cur.execute(
                    "SELECT stars, pet_slots, login_streak, last_login, perfect_streak, "
                    "inventory_resources, inventory_food FROM users WHERE id = %s",
                    (user_id,)
                )
                user_data = cur.fetchone()
                
                if not user_data:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                now = int(os.popen('date +%s%3N').read().strip())
                last_login = user_data[3] or 0
                day_diff = (now - last_login) // (24 * 60 * 60 * 1000)
                
                new_streak = user_data[2] + 1 if day_diff == 1 else 1 if day_diff > 1 else user_data[2]
                
                cur.execute(
                    "UPDATE users SET last_login = %s, login_streak = %s WHERE id = %s",
                    (now, new_streak, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'stars': user_data[0],
                        'petSlots': user_data[1],
                        'loginStreak': new_streak,
                        'perfectStreak': user_data[4],
                        'inventoryResources': user_data[5],
                        'inventoryFood': user_data[6]
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
