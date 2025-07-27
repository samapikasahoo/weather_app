export const formatTemperature = (temp: number): string => {
  return `${temp} °C`;
};

export const formatHumidity = (humidity: number): string => {
  return `${humidity} %`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${speed} km/h`;
};

export const formatUVIndex = (uvIndex: number): string => {
  return `UV Index: ${uvIndex}`;
};
