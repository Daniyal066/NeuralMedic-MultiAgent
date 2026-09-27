from neuralmedic_shared.redis_client import RedisManager

def test_redis_manager_init():
    """Test if RedisManager initializes with default values."""
    manager = RedisManager()
    # Check if defaults are applied correctly
    assert manager.host == "localhost"
    assert manager.port == 6379