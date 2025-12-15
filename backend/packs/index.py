'''
Управление стаями: создание, вступление, помощь участникам, казна
'''
import json
import os
import psycopg2
import uuid
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
                "SELECT p.id, p.name, p.creator_id, p.treasury, p.continent, p.created_at "
                "FROM packs p "
                "JOIN pack_members pm ON p.id = pm.pack_id "
                "WHERE pm.user_id = %s",
                (user_id,)
            )
            pack_data = cur.fetchone()
            
            if not pack_data:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'pack': None}),
                    'isBase64Encoded': False
                }
            
            pack_id = pack_data[0]
            cur.execute(
                "SELECT pm.user_id, u.username, pm.contribution "
                "FROM pack_members pm "
                "JOIN users u ON pm.user_id = u.id "
                "WHERE pm.pack_id = %s",
                (pack_id,)
            )
            members = cur.fetchall()
            
            result = {
                'id': pack_data[0],
                'name': pack_data[1],
                'creatorId': pack_data[2],
                'treasury': pack_data[3],
                'continent': pack_data[4],
                'createdAt': pack_data[5],
                'members': [
                    {'id': m[0], 'username': m[1], 'contribution': m[2]}
                    for m in members
                ]
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'pack': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                pack_id = str(uuid.uuid4())
                pack_name = body.get('name')
                continent = body.get('continent')
                
                now = int(os.popen('date +%s%3N').read().strip())
                
                cur.execute(
                    "INSERT INTO packs (id, name, creator_id, continent, created_at) "
                    "VALUES (%s, %s, %s, %s, %s)",
                    (pack_id, pack_name, user_id, continent, now)
                )
                
                cur.execute(
                    "INSERT INTO pack_members (pack_id, user_id, joined_at) VALUES (%s, %s, %s)",
                    (pack_id, user_id, now)
                )
                
                cur.execute("UPDATE users SET pack_id = %s WHERE id = %s", (pack_id, user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'packId': pack_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'join':
                pack_id = body.get('packId')
                now = int(os.popen('date +%s%3N').read().strip())
                
                cur.execute(
                    "INSERT INTO pack_members (pack_id, user_id, joined_at) VALUES (%s, %s, %s)",
                    (pack_id, user_id, now)
                )
                cur.execute("UPDATE users SET pack_id = %s WHERE id = %s", (pack_id, user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'donate':
                pack_id = body.get('packId')
                amount = body.get('amount')
                item_type = body.get('itemType')
                
                if item_type == 'stars':
                    cur.execute("SELECT stars FROM users WHERE id = %s", (user_id,))
                    user_stars = cur.fetchone()[0]
                    
                    if user_stars < amount:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Insufficient stars'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute("UPDATE users SET stars = stars - %s WHERE id = %s", (amount, user_id))
                    cur.execute("UPDATE packs SET treasury = treasury + %s WHERE id = %s", (amount, pack_id))
                    cur.execute(
                        "UPDATE pack_members SET contribution = contribution + %s WHERE pack_id = %s AND user_id = %s",
                        (amount, pack_id, user_id)
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
