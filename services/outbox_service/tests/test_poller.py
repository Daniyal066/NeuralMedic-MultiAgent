import unittest
from unittest.mock import MagicMock, patch, call
import sys
import os
import json

# Adjust path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import main, CHANNEL_MAPPING

class TestOutboxPoller(unittest.TestCase):
    @patch('main.connect_db')
    @patch('main.connect_redis')
    @patch('time.sleep', side_effect=InterruptedError("Stop checking")) # Stop loop
    def test_poller_logic(self, mock_sleep, mock_connect_redis, mock_connect_db):
        # Mock Redis
        mock_redis = MagicMock()
        mock_connect_redis.return_value = mock_redis
        
        # Mock DB
        mock_conn = MagicMock()
        mock_connect_db.return_value = mock_conn
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        # Mock DB data
        # First call returns rows, second call returns empty list to trigger sleep/break
        mock_cursor.fetchall.side_effect = [
            [
                {'id': '1', 'event_type': 'JOB_READY', 'payload': {'session_id': 'abc'}},
                {'id': '2', 'event_type': 'UNKNOWN_EVENT', 'payload': {'foo': 'bar'}}
            ],
            []
        ]
        
        # Run main (will raise InterruptedError to stop loop)
        try:
            main()
        except InterruptedError:
            pass
            
        # Verify Select Query
        select_call = mock_cursor.execute.call_args_list[0]
        self.assertIn("SELECT id, event_type, payload", select_call[0][0])
        self.assertIn("FROM outbox", select_call[0][0])
        self.assertIn("WHERE status = 'PENDING'", select_call[0][0])
        
        # Verify Redis Publish
        # 1. JOB_READY -> job_queue (mapped)
        mock_redis.publish.assert_any_call('job_queue', '{"session_id": "abc"}')
        # 2. UNKNOWN_EVENT -> UNKNOWN_EVENT (fallback)
        mock_redis.publish.assert_any_call('UNKNOWN_EVENT', '{"foo": "bar"}')
        
        # Verify Update Query
        # We expect 2 updates
        expected_calls = [
            call("UPDATE outbox SET status = 'PROCESSED' WHERE id = %s", ('1',)),
            call("UPDATE outbox SET status = 'PROCESSED' WHERE id = %s", ('2',))
        ]
        mock_cursor.execute.assert_has_calls(expected_calls, any_order=True)

if __name__ == '__main__':
    unittest.main()
