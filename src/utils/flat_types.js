export const types = {
  Номер: 'room',
  Студия: 'studio_flat',
  '1-комнатная квартира': '1_room_flat',
  '2-х комнатная квартира': '2_room_flat',
  '3-х комнатная квартира': '3_room_flat',
  '4-х комнатная квартира': '4_room_flat',
  '5-комнатная квартира': '5_room_flat',
  Дом: 'house',
  'Дом с участком': 'house_with_land',
  'Сауна/Баня': 'sauna',
  Другое: 'other',
};

export const convertType = type =>
  Object.keys(types).find(el => types[el] == type);

