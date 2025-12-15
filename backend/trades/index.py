'''
Торговая площадка: создание сделок, покупка, комиссия 30%
'''
import json
import os
import psycopg2
import uuid
from typing import Dict, Any

COMMISSION_RATE = 0.3

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            params = event.get('queryStringParameters') or {}
            pack_id = params.get('packId')
            
            if pack_id:
                cur.execute(
                    "SELECT t.id, t.seller_id, t.seller_name, t.item_type, t.item_id, t.item_name, "
                    "t.amount, t.price, t.created_at "
                    "FROM trades t "
                    "JOIN pack_members pm ON t.seller_id = pm.user_id "
                    "WHERE t.status = 'open' AND pm.pack_id = %s",
                    (pack_id,)
                )
            else:
                cur.execute(
                    "SELECT id, seller_id, seller_name, item_type, item_id, item_name, amount, price, created_at "
                    "FROM trades WHERE status = 'open' ORDER BY created_at DESC LIMIT 50"
                )
            
            trades = cur.fetchall()
            result = []
            for t in trades:
                result.append({
                    'id': t[0],
                    'sellerId': t[1],
                    'sellerName': t[2],
                    'itemType': t[3],
                    'itemId': t[4],
                    'itemName': t[5],
                    'amount': t[6],
                    'price': t[7],
                    'createdAt': t[8]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'trades': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                cur.execute("SELECT username FROM users WHERE id = %s", (user_id,))
                seller_name = cur.fetchone()[0]
                
                trade_id = str(uuid.uuid4())
                now = int(os.popen('date +%s%3N').read().strip())
                
                cur.execute(
                    "INSERT INTO trades (id, seller_id, seller_name, item_type, item_id, item_name, amount, price, created_at) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (trade_id, user_id, seller_name, body['itemType'], body.get('itemId'), 
                     body['itemName'], body['amount'], body['price'], now)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'tradeId': trade_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'buy':
                trade_id = body.get('tradeId')
                
                cur.execute(
                    "SELECT seller_id, item_type, item_id, item_name, amount, price FROM trades WHERE id = %s AND status = 'open'",
                    (trade_id,)
                )
                trade = cur.fetchone()
                
                if not trade:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Trade not found'}),
                        'isBase64Encoded': False
                    }
                
                seller_id, item_type, item_id, item_name, amount, price = trade
                commission = int(price * COMMISSION_RATE)
                seller_gets = price - commission
                
                cur.execute("SELECT stars FROM users WHERE id = %s", (user_id,))
                buyer_stars = cur.fetchone()[0]
                
                if buyer_stars < price:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Insufficient stars'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE users SET stars = stars - %s WHERE id = %s", (price, user_id))
                cur.execute("UPDATE users SET stars = stars + %s WHERE id = %s", (seller_gets, seller_id))
                
                if item_type == 'resource':
                    cur.execute(
                        "UPDATE users SET inventory_resources = jsonb_set("
                        "inventory_resources, '{%s}', (COALESCE((inventory_resources->>%s)::int, 0) + %s)::text::jsonb"
                        ") WHERE id = %s",
                        (item_id, item_id, amount, user_id)
                    )
                elif item_type == 'food':
                    cur.execute("UPDATE users SET inventory_food = inventory_food + %s WHERE id = %s", (amount, user_id))
                
                now = int(os.popen('date +%s%3N').read().strip())
                cur.execute(
                    "UPDATE trades SET status = 'completed', buyer_id = %s, completed_at = %s WHERE id = %s",
                    (user_id, now, trade_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'commission': commission}),
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
