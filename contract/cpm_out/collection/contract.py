from boa3.builtin.type import UInt160, UInt256, ECPoint
from boa3.builtin.compile_time import contract, display_name
from typing import cast, Any


@contract('0xf05651bc505fd5c7d36593f6e8409932342f9085')
class Collection:
    hash: UInt160

    @staticmethod
    def create_collection(description: bytes, collection_type: bytes, extra: bytes, vals: list) -> int: 
        pass

    @staticmethod
    def get_collection_json(collection_id: bytes) -> dict: 
        pass

    @staticmethod
    def get_collection(collection_id: bytes) -> list: 
        pass

    @staticmethod
    def get_collection_element(collection_id: bytes, index: int) -> bytes: 
        pass

    @staticmethod
    def get_collection_length(collection_id: bytes) -> int: 
        pass

    @staticmethod
    def get_collection_values(collection_id: bytes) -> list: 
        pass

    @staticmethod
    def map_bytes_onto_collection(collection_id: bytes, entropy: bytes) -> bytes: 
        pass

    @staticmethod
    def sample_from_collection(collection_id: bytes, samples: int) -> list: 
        pass

    @staticmethod
    def sample_from_runtime_collection(vals: list, samples: int, pick: bool) -> list: 
        pass

    @staticmethod
    def total_collections() -> int: 
        pass

    @staticmethod
    def update(script: bytes, manifest: bytes, data: Any) -> None: 
        pass