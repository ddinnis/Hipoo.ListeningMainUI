import request from "@/utils/request";
const SearchUrl = "SearchService";
const ListeningUrl = "Listening.Main";

export function getCategories() {
  return request({
    url: `/${ListeningUrl}/Category/FindAll`,
    method: "get",
  });
}
// axios.get(`${searchApiRoot}/Search/SearchEpisodes?Keyword=${word}&PageIndex=${pageIndex}&PageSize=10`);
export function searchEpisodes({ word, currentPage, pageSize = 10 }) {
  return request({
    url: `/${SearchUrl}/Search/SearchEpisodes?Keyword=${word}&PageIndex=${currentPage}&PageSize=${pageSize}`,
    method: "get",
  });
}

export function getAlbumById(id) {
  return request({
    url: `/${ListeningUrl}/Album/FindByCategoryId/${id}`,
    method: "get",
  });
}

export function getEpisodeById(id) {
  return request({
    url: `/${ListeningUrl}/Episode/FindByAlbumId/${id}`,
    method: "get",
  });
}

// const { data } = await axios.get(`${apiRoot}/Episode/FindById/${id}`);
export function getEpisode(id) {
  return request({
    url: `/${ListeningUrl}/Episode/FindById/${id}`,
    method: "get",
  });
}
