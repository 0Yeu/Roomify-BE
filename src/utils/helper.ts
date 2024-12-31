import slug from 'slug';

export const createSlug = (data: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1;
  const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const hours =
    today.getHours() < 10 ? `0${today.getHours()}` : today.getHours();
  const minutes =
    today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
  const seconds =
    today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();
  const time = `${year}${month}${date}${hours}${minutes}${seconds}`;
  return `${slug(data, { lower: true }) }-${ time}`;
};

export function enumToArray(eta) {
  return Object.keys(eta).map(key => eta[key]);
}
