import base64
from typing import Dict, Optional, Any


class Serializable:

    def __init__(self, json_dict: Optional[Dict[str, Any]]):
        if json_dict is None:
            return
        for key in json_dict.keys():
            setattr(self, key, json_dict[key])

    def serialize(self) -> Dict[str, Any]:
        attributes = self.__dict__
        res = {}
        for key in attributes.keys():
            if key[0] != '_':
                res[key] = attributes[key]
        return res


class ComparingItem(Serializable):
    def __init__(self,
                 image_path: str = None,
                 name: str = None,
                 json_dict: Dict[str, Any] = None):
        super(ComparingItem, self).__init__(json_dict)
        if json_dict is None:
            self.image = self._read_image_to_base64(image_path)
            self.name = name

    def _read_image_to_base64(self, image_path: str) -> str:
        with open(image_path, 'br+') as image:
            return str(base64.b64encode(image.read()))


class Person(Serializable):
    def __init__(self,
                 name: str = None,
                 json_dict: Optional[Dict[str, Any]] = None):
        super().__init__(json_dict)
        if json_dict is None:
            self.name = name
