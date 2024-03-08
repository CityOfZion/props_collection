from boa3.builtin.type import UInt160, UInt256, ECPoint
from boa3.builtin.compile_time import contract, display_name
from typing import cast, Any


@contract('0x4380f2c1de98bb267d3ea821897ec571a04fe3e0')
class Dice:
    hash: UInt160

    @staticmethod
    def rand_between(start: int, end: int) -> int: 
        pass

    @staticmethod
    def map_bytes_onto_range(start: int, end: int, entropy: bytes) -> int: 
        pass

    @staticmethod
    def roll_die(die: str) -> int: 
        pass

    @staticmethod
    def roll_dice_with_entropy(die: str, precision: int, entropy: bytes) -> list: 
        pass

    @staticmethod
    def update(script: bytes, manifest: bytes, data: Any) -> None: 
        pass