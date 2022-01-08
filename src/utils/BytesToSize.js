export const bytesToSize = bytes => {
  var sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  if (bytes == 0) return '0 Б';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
