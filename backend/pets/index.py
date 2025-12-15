'''
Управление питомцами: получение, обновление статуса, действия с питомцами
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    user_id = event.get('headers', {}).get('X-User-Id') or event.get('headers', {}).get('x-user-id')
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute(
                "SELECT id, pet_template_id, name, species, image, rarity, level, xp, xp_to_next_level, "
                "health, lifespan, hunger, energy, activity, vitamins, happiness, is_sick, sickness, "
                "sickness_level, steps, is_dead, boost_level, last_fed, last_visit, resting_until, "
                "equipped_clothes, equipped_toys FROM pets WHERE user_id = %s",
                (user_id,)
            )
            pets = cur.fetchall()
            
            result = []
            for pet in pets:
                result.append({
                    'id': pet[0],
                    'templateId': pet[1],
                    'name': pet[2],
                    'species': pet[3],
                    'image': pet[4],
                    'rarity': pet[5],
                    'level': pet[6],
                    'xp': pet[7],
                    'xpToNextLevel': pet[8],
                    'health': pet[9],
                    'lifespan': pet[10],
                    'hunger': pet[11],
                    'energy': pet[12],
                    'activity': pet[13],
                    'vitamins': pet[14],
                    'happiness': pet[15],
                    'isSick': pet[16],
                    'sickness': pet[17],
                    'sicknessLevel': pet[18],
                    'steps': pet[19],
                    'isDead': pet[20],
                    'boostLevel': pet[21],
                    'lastFed': pet[22],
                    'lastVisit': pet[23],
                    'restingUntil': pet[24],
                    'equippedClothes': pet[25],
                    'equippedToys': pet[26]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'pets': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            pet_data = body.get('pet')
            
            cur.execute(
                "INSERT INTO pets (user_id, pet_template_id, name, species, image, rarity) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (user_id, pet_data['id'], pet_data['name'], pet_data['species'], 
                 pet_data['image'], pet_data['rarity'])
            )
            pet_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'petId': pet_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            pet_id = body.get('petId')
            updates = body.get('updates')
            
            set_clause = ', '.join([f"{key} = %s" for key in updates.keys()])
            values = list(updates.values()) + [pet_id, user_id]
            
            cur.execute(
                f"UPDATE pets SET {set_clause} WHERE id = %s AND user_id = %s",
                values
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
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
