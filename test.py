import urllib.request
import json

def send_message(session, msg):
    req = urllib.request.Request(
        f'http://localhost:8001/chat/{session}',
        data=json.dumps({'patient_id': 'pat_chat_1', 'message': msg}).encode('utf8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req).read().decode('utf8')
    print('Patient:', msg)
    reply_obj = json.loads(res)
    print('AI:', reply_obj['reply'])
    print('Status:', reply_obj['status'])
    print('---')

send_message('sess_chat_test_1', "Nothing makes it better. That's all the info I have. Please finish the interview.")
