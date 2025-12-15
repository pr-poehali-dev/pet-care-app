'''
Платежи через Telegram: пополнение и вывод звезд
'''
import json
import os
import psycopg2
import uuid
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'create_payment':
            amount = body.get('amount')
            telegram_id = body.get('telegramId')
            
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            payment_token = os.environ.get('TELEGRAM_PAYMENT_TOKEN')
            
            if not bot_token or not payment_token:
                return {
                    'statusCode': 503,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Payment system not configured'}),
                    'isBase64Encoded': False
                }
            
            transaction_id = str(uuid.uuid4())
            now = int(os.popen('date +%s%3N').read().strip())
            
            cur.execute(
                "INSERT INTO transactions (id, user_id, type, amount, payment_method, status, created_at) "
                "VALUES (%s, %s, 'deposit', %s, 'telegram', 'pending', %s)",
                (transaction_id, user_id, amount, now)
            )
            conn.commit()
            
            invoice_data = {
                'chat_id': telegram_id,
                'title': f'Пополнение звезд Pet Life',
                'description': f'Пополнение {amount} звезд в игре Pet Life',
                'payload': transaction_id,
                'provider_token': payment_token,
                'currency': 'RUB',
                'prices': [{'label': f'{amount} звезд', 'amount': amount * 100}]
            }
            
            response = requests.post(
                f'https://api.telegram.org/bot{bot_token}/sendInvoice',
                json=invoice_data
            )
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'transactionId': transaction_id}),
                'isBase64Encoded': False
            }
        
        elif action == 'webhook':
            update = body.get('update')
            
            if 'pre_checkout_query' in update:
                query_id = update['pre_checkout_query']['id']
                bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
                
                requests.post(
                    f'https://api.telegram.org/bot{bot_token}/answerPreCheckoutQuery',
                    json={'pre_checkout_query_id': query_id, 'ok': True}
                )
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ok': True}),
                    'isBase64Encoded': False
                }
            
            elif 'message' in update and 'successful_payment' in update['message']:
                payment = update['message']['successful_payment']
                transaction_id = payment['invoice_payload']
                telegram_payment_id = payment['telegram_payment_charge_id']
                
                cur.execute(
                    "SELECT amount FROM transactions WHERE id = %s",
                    (transaction_id,)
                )
                result = cur.fetchone()
                
                if result:
                    amount = result[0]
                    now = int(os.popen('date +%s%3N').read().strip())
                    
                    cur.execute(
                        "UPDATE transactions SET status = 'completed', telegram_payment_id = %s, completed_at = %s "
                        "WHERE id = %s",
                        (telegram_payment_id, now, transaction_id)
                    )
                    cur.execute("UPDATE users SET stars = stars + %s WHERE id = %s", (amount, user_id))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ok': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
