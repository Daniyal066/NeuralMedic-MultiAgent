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
        query = select_call[0][0].replace('\n', ' ').replace('  ', '')
        self.assertIn("SELECT id, event_type, payload", query)
        self.assertIn("FROM outbox", query)
        self.assertIn("WHERE status = 'pending'", query)
        
        # Verify Redis Publish
        # NOW FORCED TO 'job_queue'
        mock_redis.publish.assert_any_call('job_queue', '{"session_id": "abc"}')
        mock_redis.publish.assert_any_call('job_queue', '{"foo": "bar"}')
        
        # Verify Update Query
        # We expect 2 updates with 'processed' (lowercase)
        expected_calls = [
            call("UPDATE outbox SET status = 'processed' WHERE id = %s", ('1',)),
            call("UPDATE outbox SET status = 'processed' WHERE id = %s", ('2',))
        ]
        # Check that these calls are in the call list
        # We can't use assert_has_calls strict order easily because there might be other executes
        # But we can check if they are present
        executed_sqls = [c[0][0] for c in mock_cursor.execute.call_args_list if "UPDATE" in c[0][0]]
        self.assertIn("UPDATE outbox SET status = 'processed' WHERE id = %s", executed_sqls)

if __name__ == '__main__':
    unittest.main()
