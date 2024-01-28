const axios = require('axios');

const api = axios.create({
  baseURL: 'https://port-0-fa-backend-f9ohr2alrm0bts5.sel5.cloudtype.app',
});

const findCampain = async (campainName) => {
  const { data, } = await api.get(`/campain/name/${campainName}`);

  return data;
};

const findPC = async (campainId, pcName) => {
  const { data, } = await api.get(`/player/campain/${campainId}/name/${pcName}`);

  return data;
}

const findSession = async (campainId, sessionNumber) => {
  const { data, } = await api.get(`/session/campain/${campainId}/number/${sessionNumber}`);

  return data;
}

exports.api = api;
exports.findCampain = findCampain;
exports.findSession = findSession;
exports.findPC = findPC;
