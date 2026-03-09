import unittest
from unittest.mock import MagicMock, AsyncMock, patch
import os
import sys

# Adjust path to import main
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import create_jobs

class TestJobCreation(unittest.IsolatedAsyncioTestCase):
    async def test_create_jobs_fan_out(self):
        # Mock the DB pool and connection
        mock_pool = MagicMock()
        mock_conn = AsyncMock()
        mock_pool.acquire.return_value.__aenter__.return_value = mock_conn
        
        # Mock transaction
        # conn.transaction() is not async, it returns an async context manager
        mock_transaction_ctx = AsyncMock()
        mock_conn.transaction = MagicMock(return_value=mock_transaction_ctx)
        
        # Mock get_db_pool to return our mock pool
        with patch('main.get_db_pool', new=AsyncMock(return_value=mock_pool)):
            session_id = "test-session-123"
            await create_jobs(session_id)
            
            # Verify transaction was used
            mock_conn.transaction.assert_called_once()
            
            # Verify 4 insert calls were made
            expected_workers = [
                'pathology_hunter',
                'biometric_analyst',
                'risk_calculator',
                'pharmacology_agent'
            ]
            
            # Check execute calls
            # We expect 4 calls to execute with the query and params
            self.assertEqual(mock_conn.execute.call_count, 4)
            
            # Extract arguments from calls
            calls = mock_conn.execute.call_args_list
            started_workers = []
            for call in calls:
                args, _ = call
                # args[0] is query, args[1] is session_id, args[2] is worker_type
                self.assertEqual(args[1], session_id)
                started_workers.append(args[2])
                
            # Verify all expected workers were started
            self.assertEqual(set(started_workers), set(expected_workers))

if __name__ == '__main__':
    unittest.main()
